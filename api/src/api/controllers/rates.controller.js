
import createHttpError from 'http-errors';
 
import { compareRates } from '../services/rateEnginev3.service.js';

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

    for (const item of items) {
        if (item.typeServices === undefined ||
            item.weight === undefined ||
            item.large === undefined ||
            item.width === undefined ||
            item.height === undefined ) {
            throw createHttpError(400, 'Each item must include typeServices, weight, large, width, and height');
        }
    }

    const result = await compareRates({
        destinationPostalCode,
        province,
        items
    });

    res.json(result);
}