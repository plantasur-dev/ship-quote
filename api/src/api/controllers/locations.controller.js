
import createHttpError from "http-errors";

import Location from "../../lib/models/location.model.js";

export const create = async (req, res) => {

    const { 
        country_code, 
        country_name, 
        admin_code,
        name,
        type } = req.body;

    const location = await Location.create({
        country_code, 
        country_name, 
        admin_code, 
        admin_full_code: country_code + '-' + admin_code, 
        name, 
        normalized_name: name, 
        type
    });

    res.status(201).json(location);
};

export const list = async (req, res) => {

    const locations = await Location.find();

    if(!locations) throw createHttpError(404, 'Locations not found');

    res.json(locations);
};

export const details = async (req, res) => {

    const locations = await Location.findById(req.params.locationId);

    if (!locations) throw createHttpError(404, 'Location not found');

    res.json(locations);
};