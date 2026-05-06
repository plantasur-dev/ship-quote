
import createHttpError from 'http-errors';
 
import { compareRates } from '../services/rateEnginev3.service.js';

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

export async function compare(req, res) {
    
    const { destinationPostalCode, province, items } = req.body;

    if (typeof destinationPostalCode !== 'string' ||
        typeof province !== 'string') {
        throw createHttpError(400, 'destinationPostalCode and province must be strings');
    }

    if (!Array.isArray(items)) {
        throw createHttpError(400, 'items must be an array');
    }
    
    if (items.length === 0) {
        throw createHttpError(400, 'items cannot be empty');
    }

    items.forEach(validateItem);

    const result = await compareRates({
        destinationPostalCode,
        province,
        items
    });

    res.json(result);
}