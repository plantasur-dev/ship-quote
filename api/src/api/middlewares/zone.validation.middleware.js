
import createHttpError from "http-errors";
import mongoose from "mongoose";
 
import Agency from "../../lib/models/agency.model.js";
import Zone from "../../lib/models/zone.model.js";
 
import { provincesData } from "../../lib/data/location.js";
 
const CALCULATION_MODES = ["pallet", "parcel"];
 
const POSTAL_CODE_RANGE_KINDS = ["exception", "prefix"];
 
const PRICING_MODES_BY_CALCULATION_MODE = {
    pallet: ["pallet_classification", "weight_volume"],
    parcel: ["real_weight", "weight_volume"]
};
 
const validProvinceNames = new Set(
    provincesData.map(province => (`${ province.countryCode }-${ province.adminCode }`))
);

const validateAgency = async (agencyId) => {
 
    if (!agencyId) {
        throw createHttpError(400, 'agencyId is required');
    }
 
    if (!mongoose.Types.ObjectId.isValid(agencyId)) {
        throw createHttpError(400, 'agencyId is not a valid id');
    }
 
    const agency = await Agency.findById(agencyId);
 
    if (!agency) {
        throw createHttpError(404, `Agency ${ agencyId } not found`);
    }
 
    if (!agency.active) {
        throw createHttpError(409, `Agency ${ agency.name } is not active`);
    }
 
    return agency;
};
 
const validateName = (name) => {
 
    if (typeof name !== 'string' || !name.trim()) {
        throw createHttpError(400, 'name is required');
    }
};
 
const validateProvinces = (provinces) => {
 
    if (!Array.isArray(provinces) || provinces.length === 0) {
        throw createHttpError(400, 'provinces must be a non-empty array');
    }
    
    const unknown = provinces.filter(
        province => !validProvinceNames.has(province)
    );
 
    if (unknown.length) {
        throw createHttpError(400, `Unknown provinces: ${ unknown.join(', ') }`);
    }
};
 
const validateCalculationMode = (calculationMode, agency) => {
 
    if (calculationMode == null) return;
 
    if (!CALCULATION_MODES.includes(calculationMode)) {
        throw createHttpError(
            400,
            `calculationMode must be one of: ${ CALCULATION_MODES.join(', ') }`
        );
    }
 
    if (calculationMode === 'pallet' && !agency.rules.supportsPallets) {
        throw createHttpError(409, `Agency ${ agency.name } does not support pallet zones`);
    }
 
    if (calculationMode === 'parcel' && !agency.rules.supportsParcels) {
        throw createHttpError(409, `Agency ${ agency.name } does not support parcel zones`);
    }
};
 
const validatePricingMode = (pricingMode, calculationMode) => {
 
    if (pricingMode == null) return;
 
    const { type, tonnagePricingRule } = pricingMode;
 
    const effectiveCalculationMode = calculationMode || 'pallet';
    const allowedPricingModes = PRICING_MODES_BY_CALCULATION_MODE[effectiveCalculationMode];
 
    if (type != null && !allowedPricingModes.includes(type)) {
        throw createHttpError(
            409,
            `pricingMode.type "${ type }" is not valid for calculationMode ` +
            `"${ effectiveCalculationMode }". Allowed: ${ allowedPricingModes.join(', ') }`
        );
    }
 
    if (tonnagePricingRule?.enabled) {
 
        const { threshold } = tonnagePricingRule;
 
        if (typeof threshold !== 'number' || threshold <= 0) {
            throw createHttpError(
                400,
                'pricingMode.tonnagePricingRule.threshold must be a positive number'
            );
        }
    }
};
 
const validateVolumetric = (volumetric) => {
 
    if (volumetric == null) return;
 
    if (volumetric.enabled
        && (typeof volumetric.factor !== 'number' || volumetric.factor <= 0)
    ) {
        throw createHttpError(
            400,
            'volumetric.factor must be a positive number when volumetric is enabled'
        );
    }
};
 
const validatePostalCodeRanges = (postalCodeRanges) => {
 
    if (postalCodeRanges == null) return;
 
    if (!Array.isArray(postalCodeRanges)) {
        throw createHttpError(400, 'postalCodeRanges must be an array');
    }
 
    postalCodeRanges.forEach((range, index) => {
 
        if (!range.from || !range.to) {
            throw createHttpError(
                400,
                `postalCodeRanges[${ index }]: from and to are required`
            );
        }
 
        if (!POSTAL_CODE_RANGE_KINDS.includes(range.kind)) {
            throw createHttpError(
                400,
                `postalCodeRanges[${ index }].kind must be one of: ${ POSTAL_CODE_RANGE_KINDS.join(', ') }`
            );
        }
 
        if (range.from > range.to) {
            throw createHttpError(
                400,
                `postalCodeRanges[${ index }]: from cannot be greater than to`
            );
        }
    });
};
 
const validateUniqueZoneName = async (agencyId, name) => {
 
    const exists = await Zone.exists({ agencyId, name: name.trim() });
 
    if (exists) {
        throw createHttpError(409, `Zone "${ name }" already exists for this agency`);
    }
};
 
const validateProvincesNotAlreadyAssigned = async (agencyId, provinces) => {
 
    const existingZones = await Zone.find({
        agencyId,
        provinces: { $in: provinces }
    });
 
    if (!existingZones.length) return;
 
    const conflicts = existingZones.flatMap(zone =>
        zone.provinces
            .filter(province => provinces.includes(province))
            .map(province => `${ province } (zone "${ zone.name }")`)
    );
 
    throw createHttpError(
        409,
        `Provinces already assigned to another zone: ${ conflicts.join(', ') }`
    );
};
 
export const zoneValidation = async (req, res, next) => {
 
    const {
        agencyId,
        name,
        provinces,
        calculationMode,
        volumetric,
        pricingMode,
        postalCodeRanges
    } = req.body;

    const agency = await validateAgency(agencyId);

    validateName(name);
    validateProvinces(provinces);
    validateCalculationMode(calculationMode, agency);
    validatePricingMode(pricingMode, calculationMode);
    validateVolumetric(volumetric);
    validatePostalCodeRanges(postalCodeRanges);

    await validateUniqueZoneName(agencyId, name);
    await validateProvincesNotAlreadyAssigned(agencyId, provinces); // REVISAR
    
    req.locals = { agency };

    next();
};