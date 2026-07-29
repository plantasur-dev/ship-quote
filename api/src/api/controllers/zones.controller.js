
import createHttpError from "http-errors";

import Zone from "../../lib/models/zone.model.js";
import zonesFull from "../services/zones.services.js";

export const create = async (req, res) => {

    const {  
        name, 
        provinces, 
        calculationMode,
        volumetric,
        pricingMode,
    } = req.body;

    const agency = req.locals.agency;

    const zone = await Zone.create({
        agencyId: agency._id, 
        name, 
        provinces, 
        calculationMode,
        volumetric,
        pricingMode,
    });

    res.status(201).json(zone);
};

export const list = async (req, res) => {

    const zones = await Zone
        .find()
        .populate('agencyId', 'name code');

    if (!zones.length) throw createHttpError(404, 'Zones not found');

    res.json(zones);
};

export const details = async (req, res) => {

    const zone = await Zone
        .findById(req.params.zoneId)
        .populate('agencyId', 'name code')
        .populate('rules');

    if (!zone) throw createHttpError(404, 'Zone not found');

    res.json(zone);
};

export const full = async (req, res) => {
 
    const {
        zones,
        calculationMode,
        pricingMode,
        volumetric,
        exceptions
    } = req.body;
 
    const agency = req.locals.agency;
 
    const insertedZones = await zonesFull({
        agency,
        zones,
        calculationMode,
        pricingMode,
        volumetric,
        exceptions
    });
 
    res.status(201).json(insertedZones);
};