
import createHttpError from 'http-errors';
 
import { compareRates } from '../services/rateEnginev3.service.js';

export async function compare(req, res) {
    
    const { destinationPostalCode, province, items } = req.body;

    if (!destinationPostalCode || !province || !items) {
        throw createHttpError(400, 'Missing fields');
    }

    const result = await compareRates({
        destinationPostalCode,
        province,
        items
    });

    res.json(result);
}