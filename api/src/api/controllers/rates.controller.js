
import createHttpError from 'http-errors';

import { getProvinceByPostalCode } from '../services/provinces.service.js';

import rates from '../services/rates.service.js';

export async function compareByProvinceCode(req, res) {
    const { destinationPostalCode, province, items } = req.body;

    const result = await rates({
        destinationPostalCode,
        province,
        items
    });

    if(!result) throw createHttpError(404, 'Compare not found');

    res.json(result);
}

export async function compareByPostalCode(req, res) {
    const { destinationPostalCode, countryCode, items } = req.body;

    const province = getProvinceByPostalCode(
        destinationPostalCode
    );

    const isDefaultCountry = 
        countryCode === process.env.DEFAULT_COUNTRY;

    if (!province && isDefaultCountry) {
        throw createHttpError(404, 'Province not found');
    }

    const result = await rates({
        destinationPostalCode,
        countryCode,
        province: province?.adminFullCode ?? '',
        items
    });

    if(!result) throw createHttpError(404, 'Compare not found');

    res.json(result);
}