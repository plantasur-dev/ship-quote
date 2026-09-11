
import * as ZoneValidation from '../../lib/utils/middleware/zone.middleware.utils.js';
import * as UtilValidation from '../../lib/utils/middleware/middleware.utils.js';


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

    const agency = await UtilValidation.validateAgency(agencyId);

    const normalizedName = UtilValidation.normalizeString(name);

    UtilValidation.validateName(normalizedName);
    ZoneValidation.validateProvinces(provinces);
    ZoneValidation.validateCalculationMode(calculationMode, agency);
    ZoneValidation.validatePricingMode(pricingMode, calculationMode);
    ZoneValidation.validateVolumetric(volumetric);
    ZoneValidation.validatePostalCodeRanges(postalCodeRanges);

    await ZoneValidation.validateUniqueZoneName(agencyId, name);
    await ZoneValidation.validateProvincesNotAlreadyAssigned(agencyId, provinces);
    
    req.locals = { agency };
    req.body.name = normalizedName;

    next();
};

export const zoneFullValidation = async (req, res, next) => {
 
    const {
        agencyId,
        zones,
        calculationMode,
        volumetric,
        pricingMode,
        exceptions = []
    } = req.body;
 
    const agency = await UtilValidation.validateAgency(agencyId);
 
    ZoneValidation.validateZonesArray(zones);
    ZoneValidation.validateCalculationMode(calculationMode, agency);
    ZoneValidation.validatePricingMode(pricingMode, calculationMode);
    ZoneValidation.validateVolumetric(volumetric);

    const normalizedZones = zones.map(zone => ({
        ...zone,
        name: UtilValidation.normalizeString(zone.name)        
    }));
 
    const zoneNames = new Set(normalizedZones.map(zone => zone.name));
    ZoneValidation.validateExceptions(exceptions, zoneNames);

    await ZoneValidation.validateUniqueZoneNames(agencyId, [...zoneNames]);
    await ZoneValidation.validateProvinceZoneCoverage(agencyId, normalizedZones, exceptions);

    req.locals = { agency };

    req.body.zones = normalizedZones;
 
    next();    
};