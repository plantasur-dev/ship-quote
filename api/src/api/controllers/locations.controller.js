
import createHttpError from "http-errors";

import Location from "../../lib/models/location.model.js";

import { listCountries } from '../services/locations.service.js';

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

export const list = async (req, res) => {

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

export const countries = async (req, res) => {

    const countries = await listCountries();

    if (!countries) throw createHttpError(countries?.error, countries?.message);

    res.json(countries);
};