
import createHttpError from 'http-errors';

const isInvalidNumber = (value) => {
    const n = Number(value);
    return isNaN(n) || n <= 0;
};

const validateItem = (item, index) => {
    const errors = [];

    if (item.typeServices == null) {
        errors.push('typeServices is required');
    }

    if (isInvalidNumber(item.weight)) {
        errors.push('weight must be a number > 0');
    }

    if (isInvalidNumber(item.large)) {
        errors.push('large must be a number > 0');
    }

    if (isInvalidNumber(item.width)) {
        errors.push('width must be a number > 0');
    }

    if (isInvalidNumber(item.height)) {
        errors.push('height must be a number > 0');
    }

    if (errors.length) {
        throw createHttpError(400, `Item ${index + 1}: ${errors.join(', ')}`);
    }
};

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

    if (destinationPostalCode == null 
        || countryCode == null
    ) {
        throw createHttpError(400, 'destinationPostalCode and countryCode is required');
    }

    if (typeof destinationPostalCode !== 'string' 
        || typeof countryCode !== 'string'
    ) {
        throw createHttpError(400, 'destinationPostalCode and countryCode must be strings');
    }

    if (!/^\d{5}$/.test(destinationPostalCode) 
        && countryCode === process.env?.DEFAULT_COUNTRY
    ) {
        throw createHttpError(400, 'Postal Code invalid');
    }

    next();
};
