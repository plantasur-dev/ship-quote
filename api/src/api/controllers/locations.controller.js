
import createHttpError from "http-errors";

import Location from "../../lib/models/location.model.js";

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

export const listProvinces = async (req, res) => {

    const criteria = {};

    if (req.query.address) {
        criteria.normalizedName = { $regex: req.query.address, $options: "i" };
    }

    const locations = await Location
        .find( criteria );

    if(!locations) throw createHttpError(404, 'Locations not found');

    res.json(locations);
};

export const details = async (req, res) => {

    const locations = await Location.findById(req.params.locationId);

    if (!locations) throw createHttpError(404, 'Location not found');

    res.json(locations);
};

export const listCountries = async (req, res) => {

    const countries = await country.listCountries();
    
    if (countries?.error) {
        const { status, message } = countries.error;

        throw createHttpError(status, message);
    }
    
    res.json(countries);
};