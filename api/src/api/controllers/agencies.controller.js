
import createHttpError from "http-errors";

import merge from 'lodash/merge.js';

import Agency from "../../lib/models/agency.model.js";


export async function create(req, res) {

    const { active, name, type, rules, supplements, apiConfig } = req.body;

    if (!name) throw createHttpError(400, 'Name is required');

    const agency = await Agency.create({ 
        active,
        name,
        type, 
        rules,
        supplements,
        apiConfig 
    });

    res.status(201).json(agency);
};

export async function list(req, res) {
    
    const agencies = await Agency.find();

    if (!agencies.length) throw createHttpError(404, 'Agencies not found');

    res.json(agencies);
};

export async function update(req, res) {
    
    const { agencyId } = req.params;

    const agency = await Agency.findById(agencyId);

    if (!agency) throw createHttpError(404, 'Agency not found');

    const { active, type, apiConfig, supplements, rules } = req.body;

    const criteria = {};

    if (active) criteria.active = active;
    if (type) criteria.type = type;
    if (rules) criteria.rules = rules;
    
    if (supplements) {
        criteria.supplements = merge(
            {},
            agency.supplements?.toObject(),
            supplements
        );
    }

    if (apiConfig) {
        criteria.apiConfig = merge(
            {},
            agency.apiConfig?.toObject(),
            apiConfig
        );
    }
        
    Object.assign(agency, criteria);

    await agency.save();

    res.json(agency);
}

export async function toggleAgencyActive(req, res) {
    
    const agency = await Agency.findById(req.params.agencyId);

    if (!agency) throw createHttpError(404, 'Agency not found');

    Object.assign(agency, { active: !agency.active });

    await agency.save();

    res.json(agency);
};

export async function updateFuelSurcharge(req, res) {

    const agency = await Agency.findById(req.params.agencyId);

    if (!agency) throw createHttpError(404, 'Agency not found');

    const { enabled, type, value } = req.body;

    if (!agency.supplements?.fuelSurcharge?.enabled && !enabled ) {
        throw createHttpError(400, 'Supplements fuel surcharge is not active');
    }

    const { fuelSurcharge } = agency.supplements;
        
    agency.supplements ??= {};
    agency.supplements.fuelSurcharge = { 
        enabled: enabled ?? fuelSurcharge?.enabled, 
        type: type ?? fuelSurcharge?.type, 
        value: value ?? fuelSurcharge.value 
    };

    await agency.save();

    res.json(agency.supplements.fuelSurcharge);   
}