
import createHttpError from "http-errors";

import Agency from "../../lib/models/agency.model.js";

export async function create(req, res) {

    const { name, type, rules, apiConfig } = req.body;

    if (!name) throw createHttpError(400, 'Name is required');

    const agency = await Agency.create({ 
        name, 
        code: name.toLowerCase(), 
        type, 
        rules,
        apiConfig 
    });

    res.status(201).json(agency);
};

export async function list(req, res) {
    
    const agencies = await Agency.find();

    if (!agencies.length) throw createHttpError(404, 'Agencies not found');

    res.json(agencies);
};

export async function updateAgencyStatus(req, res) {
    
    const agency = await Agency.findById(req.params.agencyId);

    if (!agency) throw createHttpError(404, 'Agency not found');

    Object.assign(agency, { active: !agency.active });

    await agency.save();

    res.json(agency);
};