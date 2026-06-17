
import createHttpError from "http-errors";

import Location from "../../lib/models/location.model.js";

import { 
    getProvinceByPostalCode,
    getProvinces
} from "../services/provinces.service.js";

import * as country from '../services/countries.service.js';

export const create = async (req, res) => {

    const { 
        countryCode, 
        countryName, 
        adminCode,
        name,
        type 
    } = req.body;

    const location = await Location.create({
        countryCode, 
        countryName, 
        adminCode, 
        adminFullCode: countryCode + '-' + adminCode, 
        name, 
        normalizedName: name, 
        type
    });

    res.status(201).json(location);
};

export const provincesByPostalCode = (req, res) => {

    const { postalCode } = req.params;
    
    if (!/^\d{5}$/.test(postalCode)) {
        throw createHttpError(400, 'Incorrect Postal Code');
    } 

    const provinces = getProvinceByPostalCode(
        postalCode
    );

    if (!provinces) {
        throw createHttpError(404, 'Province not found');
    }

    res.json(provinces);
};

export const provincesByAddress = async (req, res) => {

    const criteria = {};

    if (req.query.address) {
        criteria.normalizedName = { 
            $regex: req.query.address, 
            $options: "i" 
        };
    }

    const locations = await Location.find( criteria );

    if(!locations.length) throw createHttpError(404, 'Provinces not found');

    res.json(locations);
};

export const listProvinces = (req, res) => {

    const provinces = getProvinces();

    if (!provinces) {
        throw createHttpError(404, 'Provinces not founds');
    }

    res.json(provinces);
};

export const listCountries = (req, res) => {

    const langCode = (req.query.lang ?? 'ES').toUpperCase();

    const countries = country.listCountries(langCode);
    
    if (!countries.length) throw createHttpError(404, 'Countries not found');
    
    res.json(countries);
};