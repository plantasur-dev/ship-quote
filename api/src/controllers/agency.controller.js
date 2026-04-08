
import Agency from "../models/agency.model.js";

export async function create(req, res) {

    const { name, code, type, rules } = req.body;

    const agency = await Agency.create({ 
        name, 
        code: code.toLowerCase(), 
        type, 
        rules 
    });

    res.status(201).json(agency);
};

export async function list(req, res) {
    
    const agencies = await Agency.find();

    res.json(agencies);
}