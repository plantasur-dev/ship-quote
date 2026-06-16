
import createHttpError from 'http-errors';

import { getProvinceByPostalCode } from '../services/provinces.service.js';

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

export async function compareByCodePostal(req, res) {
    const { destinationPostalCode, items } = req.body;

    const province = getProvinceByPostalCode(
        destinationPostalCode
    );

    if (!province) {
        throw createHttpError(404, 'Province not found');
    }

    const result = await rates({
        destinationPostalCode,
        province: province.adminFullCode,
        items
    });

    if(!result) throw createHttpError(404, 'Compare not found');

    res.json(result);
}