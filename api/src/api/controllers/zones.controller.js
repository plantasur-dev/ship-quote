
import createHttpError from "http-errors";

import Zone from "../../lib/models/zone.model.js";
import ZoneRules from "../../lib/models/zone.rules.model.js";

export const create = async (req, res) => {

    const {  
        name, 
        provinces, 
        calculationMode,
        volumetric,
        pricingMode,
        postalCodeRanges 
    } = req.body;
    console.log(req.locals)
    const agency = req.locals.agency;

    const zone = await Zone.create({
        agencyId: agency._id, 
        name, 
        provinces, 
        calculationMode,
        volumetric,
        pricingMode,
    });
    
    const zoneRulesProvinces = provinces.map(province => ({
        zoneId: zone.id,
        agencyId: agency._id,
        province,
        postalCodeRanges
    }));
    
    const zoneRule = await ZoneRules.insertMany(zoneRulesProvinces);
    
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
        .populate('agencyId', 'name code');

    if (!zone) throw createHttpError(404, 'Zone not found');

    res.json(zone);
};