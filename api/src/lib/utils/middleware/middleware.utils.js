
import createHttpError from "http-errors";

import mongoose from "mongoose";

import Agency from "../../models/agency.model.js";
import Zone from '../../models/zone.model.js';
import PalletType from "../../models/palletType.model.js";

export const isInvalidNumber = (value, { allowZero = false } = {}) => {
    const n = Number(value);
    return Number.isNaN(n) || (allowZero ? n < 0 : n <= 0);
};

export const normalizeString = (value) => {
    if (typeof value !== 'string') return null;

    const normalized = value.trim();
    return normalized.length ? normalized : null;
};

export const validateName = (name) => {
 
    if (typeof name !== 'string' || !name.trim()) {
        throw createHttpError(400, 'name is required');
    }
};

export const validatePalletType = async (palletTypeId) => {
    
    if (palletTypeId == null || palletTypeId === '') {
        throw createHttpError(400, `palletTypeId is required`);
    } 

    if (!mongoose.Types.ObjectId.isValid(palletTypeId)) {
        throw createHttpError(400, 'palletTypeId is not a valid id');
    }

    const palletType = await PalletType.findById(palletTypeId);

    if (!palletType) {
        throw createHttpError(404, `PalletType ${ palletTypeId} not found`);
    }

    return palletTypeId;
};

export const validateAgency = async (agencyId) => {
 
    if (!agencyId) {
        throw createHttpError(400, 'agencyId is required');
    }
 
    if (!mongoose.Types.ObjectId.isValid(agencyId)) {
        throw createHttpError(400, 'agencyId is not a valid id');
    }
 
    const agency = await Agency.findById(agencyId);
 
    if (!agency) {
        throw createHttpError(404, `Agency ${ agencyId } not found`);
    }
 
    if (!agency.active) {
        throw createHttpError(409, `Agency ${ agency.name } is not active`);
    }

    if (agency.type === 'api') {
        throw createHttpError(400, `Agency ${ agencyId } is type API`);
    }
 
    return agency;
};

export const validateZone = async (agencyId, zoneName) => {

    if (!agencyId) {
        throw createHttpError(400, 'agencyId is required');
    }

    if (!zoneName) {
        throw createHttpError(400, 'zoneName is required');
    }

    const zone = await Zone.findOne({ agencyId, name: zoneName });

    if (!zone) throw createHttpError(404, `Zone ${ zoneName } not found`);

    return zone;
};