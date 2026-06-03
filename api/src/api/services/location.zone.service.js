
import mongoose from "mongoose";

import Location from '../../lib/models/location.model.js';

import logger from '../../lib/logger/logger.js';

import { 
    provincesData, 
    specialIslands 
} from '../../lib/data/location.js';

function normalizeName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function createLocations(locationsArray) {
    const provinces = [];

    locationsArray.forEach(p => {
        provinces.push({
            countryCode: "ES",
            countryName: "Spain",
            adminCode: p.adminCode,
            adminFullCode: `ES-${p.adminCode}`,
            name: p.name,
            normalizedName: normalizeName(p.name),
            postalCode: p.postalCode,
            type: "province"
        });
    });

    return provinces;
}

export const initLocations = async () => {
    const collections = await mongoose.connection.db.listCollections({ name: "locations" }).toArray();
    if (collections.length > 0) {
        logger.info({
            event: 'locations:bootstrap:skip',
            message: `La colección 'location' ya existe. No se realiza ninguna acción.`,
            component: 'database'
        });
        return;
    }

    logger.info({
        event: 'locations:bootstrap:start',
        message: "Creando la colección 'locations' y poblando datos...",
        component: 'database'
    });

    const provinces = [];

    provinces.push(createLocations(provincesData));
    provinces.push(createLocations(specialIslands));

    const locationsAll = provinces.flat();

    await Location.insertMany(locationsAll);
    
    logger.info({
        event: 'locations:bootstrap:success',
        message: `Se han insertado ${ locationsAll.length } provincias en la colección 'locations'.`,
        component: 'database'
    });
}