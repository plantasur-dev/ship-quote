
import logger from "../logger/logger.js";

import Agency from "../models/agency.model.js";
import Rate from "../models/rate.model.js";
import Zone from "../models/zone.model.js";
import ZoneRules from '../models/zone.rules.model.js';
import PalletType from "../models/palletType.model.js";

const models = {
    rate: Rate,
    zone: Zone,
    zoneRule: ZoneRules,
    palletType: PalletType
};

const logLevels = {
    success: 'info',
    warning: 'warn',
    error: 'error'
}

export const loggerMsg = ({ status, collection, message }) => {

    const level = logLevels[status];
    
    logger[level]?.({
        event: `${ collection?.toLowerCase() ?? 'unknown' }:bootstrap:${ status }`,
        service: 'ship-quote-api',
        message,
        component: 'database'
    });
}

export const checkExists = async ({ code, collection }) => {
    const agency = await Agency.findOne({ code });
   
    if (!agency) {
        loggerMsg({ 
            status: 'error',
            collection,
            message: `No existe ${ code }`,
        });
        return null;
    }

    const Model = models[collection];

    if (!Model) {
        loggerMsg({ 
            status: 'error',
            collection,
            message: `Modelo no válido: ${ collection }`,
        });
        return null;
    }

    const exists = await Model.findOne({ agencyId: agency.id });

    if (exists) {
        loggerMsg({ 
            status: 'warning',
            collection,
            message: `${ collection } ya existen para ${ agency.name }, se omite`,
        });
        return null;
    }

    return { agency, model: Model };
}