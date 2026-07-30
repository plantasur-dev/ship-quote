
import * as ZoneValidation from '../../lib/utils/zone.middleware.utils.js';
 
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

    const agency = await ZoneValidation.validateAgency(agencyId);

    ZoneValidation.validateName(name);
    ZoneValidation.validateProvinces(provinces);
    ZoneValidation.validateCalculationMode(calculationMode, agency);
    ZoneValidation.validatePricingMode(pricingMode, calculationMode);
    ZoneValidation.validateVolumetric(volumetric);
    ZoneValidation.validatePostalCodeRanges(postalCodeRanges);

    await ZoneValidation.validateUniqueZoneName(agencyId, name);
    await ZoneValidation.validateProvincesNotAlreadyAssigned(agencyId, provinces);
    
    req.locals = { agency };

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
 
    const agency = await ZoneValidation.validateAgency(agencyId);
 
    ZoneValidation.validateZonesArray(zones);
    ZoneValidation.validateCalculationMode(calculationMode, agency);
    ZoneValidation.validatePricingMode(pricingMode, calculationMode);
    ZoneValidation.validateVolumetric(volumetric);
 
    const zoneNames = new Set(zones.map(zone => zone.name.trim()));
    ZoneValidation.validateExceptions(exceptions, zoneNames);

    await ZoneValidation.validateUniqueZoneNames(agencyId, [...zoneNames]);
    await ZoneValidation.validateProvinceZoneCoverage(agencyId, zones, exceptions);

    req.locals = { agency };
 
    next();    
};