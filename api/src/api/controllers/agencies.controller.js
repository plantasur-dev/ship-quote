
import createHttpError from "http-errors";

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

export async function details(req, res) {
    
    const { agencyId } = req.params;

    const agency = await Agency.findById(agencyId);

    if (!agency) throw createHttpError(404, 'Agency not found');

    res.json(agency);
}

export async function update(req, res) {

    const { agencyId } = req.params;

    const agency = await Agency.findById(agencyId);

    if (!agency) throw createHttpError(404, 'Agency not found');

    const { apiConfig, supplements, rules, ...rest } = req.body;
    
    Object.assign(agency, rest);

    if (rules){
        agency.rules = {
            ...agency.rules.toObject(),
            ...rules
        }
    }
    
    if (supplements) {
        agency.supplements = {
            ...agency.supplements.toObject(),
            ...supplements
        };
    }

    if (apiConfig) {
        agency.apiConfig = {
            ...agency.apiConfig.toObject(),
            ...apiConfig,
        };
    }

    await agency.save();

    res.json(agency);
}

export async function remove(req, res) {
    
    const agency = await Agency.findById(req.params.agencyId);

    if (!agency) throw createHttpError(404, 'Agency not found');

    if (!req.session?.user) throw createHttpError(401, 'Unauthorized');
    
    await Agency.findByIdAndDelete(agency.id);

    res.status(204).json();
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