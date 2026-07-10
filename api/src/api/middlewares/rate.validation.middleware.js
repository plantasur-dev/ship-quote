
import createHttpError from 'http-errors';

import { SHIPMENT_UNIT_VALUES } from '../../lib/constants/shipment.units.js';

const isInvalidNumber = (value) => {
    const n = Number(value);
    return isNaN(n) || n <= 0;
};

const validateItem = (item, index) => {
    const errors = [];

    if (item.typeServices == null) {
        errors.push('typeServices is required');
    } else {
        const normalizedTypeServices = item.typeServices.trim().toLowerCase();

        if (!SHIPMENT_UNIT_VALUES.includes(normalizedTypeServices)) {
            errors.push('typeServices unknown');
        } else {
            item.typeServices = normalizedTypeServices;
        }
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
        throw createHttpError(400, `Item ${ index + 1 }: ${ errors.join(', ') }`);
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
        throw createHttpError(400, 'destinationPostalCode and countryCode are required fields');
    }

    if (typeof destinationPostalCode !== 'string' 
        || typeof countryCode !== 'string'
    ) {
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
