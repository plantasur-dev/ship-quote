
import mongoose from "mongoose";

import Location from '../../lib/models/location.model.js';

import { 
    provincesData, 
    specialIslands 
} from '../../lib/storages/location.storage.js';

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
        console.log("La colección 'location' ya existe. No se realiza ninguna acción.");
        return;
    }

    console.log("Creando la colección 'location' y poblando datos...");

    const provinces = [];

    provinces.push(createLocations(provincesData));
    provinces.push(createLocations(specialIslands));

    const locationsAll = provinces.flat();

    await Location.insertMany(locationsAll);
    
    console.log(`Se han insertado ${ locationsAll.length } provincias en la colección 'location'.`);
}