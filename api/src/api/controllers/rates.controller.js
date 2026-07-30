
import createHttpError from 'http-errors';

import Rate from '../../lib/models/rate.model.js';

import { getProvinceByCountryCodeAndPostalCode } from '../services/provinces.service.js';

export async function create(req, res) {

    const {
        agencyId,
        type,
        zoneName,
        palletTypeId,
        calculationType,
        services
    } = req.body;

    const rate = await Rate.create({
        agencyId,
        type,
        zoneName,
        palletTypeId,
        calculationType,
        services
    });

    res.status(201).json(rate);
};

export async function compareByProvinceCode(req, res) {
    const { destinationPostalCode, countryCode, province, items } = req.body;

    const result = await rates({
        destinationPostalCode,
        countryCode,
        province,
        items
    });

    if(!result) throw createHttpError(404, 'Compare not found');

    res.json(result);
}

export async function compareByPostalCode(req, res) {
    const { destinationPostalCode, countryCode, items } = req.body;

    const isDefaultCountry = 
        countryCode === process.env.DEFAULT_COUNTRY;

    const province = getProvinceByCountryCodeAndPostalCode(
        countryCode, 
        destinationPostalCode
    );

    if (isDefaultCountry && !province) {
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