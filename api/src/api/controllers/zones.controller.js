
import createHttpError from "http-errors";

import Zone from "../../lib/models/zone.model.js";
import { createZoneWithRules } from "../services/zones.service.js";

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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 14;

    const startIndex = (page - 1) * limit;

    const [zones, total] = await Promise.all([ 
        Zone.find()
            .populate('agencyId', 'name code')
            .limit(limit)
            .skip(startIndex),
        Zone.countDocuments()
    ]);
        
    if (!zones.length) throw createHttpError(404, 'Zones not found');

    const totalPages = Math.ceil(total / limit);

    res.json({
        zones, 
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    });
};

export const details = async (req, res) => {

    const zone = await Zone
        .findById(req.params.zoneId)
        .populate({
            path:'agencyId', 
            select: 'name code'
        })
        .populate('rules')
        .populate({ 
            path: 'rates',
            select: 'services'
        });

    if (!zone) throw createHttpError(404, 'Zone not found');

    res.json(zone);
};

export const createWithRules = async (req, res) => {
 
    const {
        zones,
        calculationMode,
        pricingMode,
        volumetric,
        exceptions
    } = req.body;
 
    const agency = req.locals.agency;
 
    const insertedZones = await createZoneWithRules({
        agency,
        zones,
        calculationMode,
        pricingMode,
        volumetric,
        exceptions
    });
 
    res.status(201).json(insertedZones);
};