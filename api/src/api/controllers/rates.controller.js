
import createHttpError from 'http-errors';

import rates from '../services/rates.service.js';

export async function compare(req, res) {
    const { destinationPostalCode, province, items } = req.body;

    const result = await rates({
        destinationPostalCode,
        province,
        items
    });

    if(!result) throw createHttpError(404, 'Compare not found');

    res.json(result);
}