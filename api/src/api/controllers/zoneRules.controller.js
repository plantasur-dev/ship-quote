
import createHttpError from "http-errors";

import Zone from "../../lib/models/zone.model.js";
import ZoneRules from "../../lib/models/zone.rules.model.js";

export const create = async (req, res) => {

    const { zoneId } = req.params;
    
    const zone = await Zone.findById(zoneId);

    if (!zone) throw createHttpError(404, 'Zone not found');

    const { 
        province,
        postalCodeRanges
    } = req.body;

    const zoneRules = await ZoneRules.create({
        zoneId,
        agencyId: zone.agencyId,
        province,
        postalCodeRanges
    });

    res.status(201).json(zoneRules);
};

export const details = async (req, res) => {

    const { zoneId } = req.params;

    const zoneRules = await ZoneRules
        .find({ zoneId })
        .populate('zoneId');

    if (!zoneRules.length) throw createHttpError(404, 'Zone Rules not founds');

    res.json(zoneRules);
};