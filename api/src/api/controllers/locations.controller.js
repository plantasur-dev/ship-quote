
import createHttpError from "http-errors";
import Location from "../../lib/models/location.model.js";
import * as provinces from "../services/provinces.service.js";
import * as countries from '../services/countries.service.js';


export const create = async (req, res) => {

    const { 
        countryCode,
        postalCode, 
        countryName, 
        adminCode,
        name,
        type 
    } = req.body;

    const location = await Location.create({
        countryCode,
        postalCode, 
        countryName, 
        adminCode, 
        adminFullCode: countryCode + '-' + adminCode, 
        name, 
        normalizedName: name, 
        type
    });

    res.status(201).json(location);
};

export const listProvinces = (req, res) => {

    const result = provinces.getProvinces();

    if (!result.length) {
        throw createHttpError(404, 'Provinces not found');
    }

    res.json(result);
};

export const getProvince = (req, res) => {

    const { countryCode, postalCode } = req.params;
    
    const province = provinces.getProvinceByCountryCodeAndPostalCode(
        countryCode,
        postalCode
    );

    if (!province) {
        throw createHttpError(404, 'Province not found');
    }

    res.json(province);
};

export const listCountries = (req, res) => {

    const langCode = (req.query.lang ?? 'ES').toUpperCase();

    const result = countries.listCountries(langCode);
    
    if (!result.length) throw createHttpError(404, 'Countries not found');
    
    res.json(result);
};

export const listCountryProvinces = (req, res) => {

    const { countryCode } = req.params;

    const result = provinces.getProvincesByCountryCode(countryCode);

    if (!result.length) {
        throw createHttpError(404, 'Provinces not found');
    }

    res.json(result);
};