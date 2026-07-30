
import createHttpError from 'http-errors';

import { 
    SHIPMENT_UNIT_VALUES, 
    CALCULATION_TYPES_RATE 
} from '../../lib/constants/index.js';

import { 
    validateService, 
    validateItem 
} from '../../lib/utils/middleware/rate.middleware.utils.js';

import { 
    normalizeString, 
    validateAgency,
    validatePalletType 
} from '../../lib/utils/middleware/middleware.utils.js';

export const rateItemsValidation = (req, res, next) => {
    const { items } = req.body;

    if (!Array.isArray(items)) {
        throw createHttpError(400, 'items must be an array');
    }

    if (items.length === 0) {
        throw createHttpError(400, 'items cannot be empty');
    }

    items.forEach(validateItem);

    next();
};

export const rateDestinationValidation = (req, res, next) => {

    const { destinationPostalCode, countryCode } = req.body;

    if (destinationPostalCode == null || countryCode == null) {
        throw createHttpError(400, 'destinationPostalCode and countryCode are required fields');
    }

    if (typeof destinationPostalCode !== 'string' || typeof countryCode !== 'string') {
        throw createHttpError(400, 'destinationPostalCode and countryCode must be strings');
    }

    const normalizedCountry = countryCode.trim().toUpperCase();
    const normalizedPostalCode = destinationPostalCode.trim();

    if (!/^[A-Z]{2}$/.test(normalizedCountry)) {
        throw createHttpError(400, `countryCode invalid: received "${ normalizedCountry }"`);
    }

    if (!normalizedPostalCode.length) {
        throw createHttpError(400, 'destinationPostalCode cannot be empty');
    }

    if (normalizedCountry === process.env.DEFAULT_COUNTRY
        && !/^\d{5}$/.test(normalizedPostalCode)
    ) {
        throw createHttpError(400, 'Postal Code invalid');
    }

    req.body.countryCode = normalizedCountry;
    req.body.destinationPostalCode = normalizedPostalCode;

    next();
};

export const rateValidation = async (req, res, next) => {
    const {
        agencyId,
        type,
        zoneName,
        palletTypeId,
        calculationType,
        services
    } = req.body;

    const agency = await validateAgency(agencyId);

    await validatePalletType(palletTypeId);
   
    const normalizedType = normalizeString(type);
    
    if (normalizedType == null) {
        throw createHttpError(400, 'type is required');
    }

    const loweredType = normalizedType.toLowerCase();

    if (!SHIPMENT_UNIT_VALUES.includes(loweredType)) {
        throw createHttpError(400, `type must be one of: ${ SHIPMENT_UNIT_VALUES.join(', ') }`);
    }

    const normalizedZoneName = normalizeString(zoneName);

    if (normalizedZoneName == null) {
        throw createHttpError(400, 'zoneName is required');
    }
    
    if (calculationType != null) {
        const normalizedCalculationType = normalizeString(calculationType);

        if (normalizedCalculationType == null) {
            throw createHttpError(400, 'calculationType cannot be empty');
        }

        const loweredCalculationType = normalizedCalculationType.toLowerCase();

        if (!CALCULATION_TYPES_RATE.includes(loweredCalculationType)) {
            throw createHttpError(400, 'calculationType must be one of: unit, quantity');
        }

        req.body.calculationType = loweredCalculationType;
    }

    if (!Array.isArray(services) || services.length === 0) {
        throw createHttpError(400, 'services must be a non-empty array');
    }

    services.forEach(validateService);

    req.locals = { agency };
    req.body.type = loweredType;
    req.body.zoneName = normalizedZoneName;

    next();
};