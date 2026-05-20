
import createHttpError from "http-errors";

import Zone from "../../lib/models/zone.model.js";

export const create = async (req, res) => {

    const { 
        agencyId, 
        name, 
        provinces, 
        calculationMode, 
        postalCodeExceptions 
    } = req.body;

    const zone = await Zone.create({
        agencyId, 
        name, 
        provinces, 
        calculationMode, 
        postalCodeExceptions
    });

    res.status(201).json(zone);
};

export const list = async (req, res) => {

    const zones = await Zone
        .find()
        .populate('agencyId', 'name code');

    if (!zones) throw createHttpError(404, 'Zones not found');

    res.json(zones);
};

export const details = async (req, res) => {

    const zone = await Zone
        .findById(req.params.zoneId)
        .populate('agencyId', 'name code');

    if (!zone) throw createHttpError(404, 'Zone not found');

    res.json(zone);
};