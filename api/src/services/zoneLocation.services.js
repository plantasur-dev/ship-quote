
import mongoose from "mongoose";
import Location from '../models/location.model.js';
import { provincesData, specialIslands } from '../stores/location.stores.js';

function normalizeName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

export const initLocations = async () => {
    const collections = await mongoose.connection.db.listCollections({ name: "locations" }).toArray();
    if (collections.length > 0) {
        console.log("La colección 'location' ya existe. No se realiza ninguna acción.");
        return;
    }

    console.log("Creando la colección 'location' y poblando datos...");

    const provinces = [];

    // Provincias normales
    provincesData.forEach(p => {
        provinces.push({
            country_code: "ES",
            country_name: "Spain",
            admin_code: p.admin_code,
            admin_full_code: `ES-${p.admin_code}`,
            name: p.name,
            normalized_name: normalizeName(p.name),
            type: "province"
        });
    });

    // Islas especiales
    specialIslands.forEach(p => {
        provinces.push({
            country_code: "ES",
            country_name: "Spain",
            admin_code: p.admin_code,
            admin_full_code: `ES-${p.admin_code}`, // código único
            name: p.name,
            normalized_name: normalizeName(p.name),
            type: "province"
        });
    });

    await Location.insertMany(provinces);
    console.log(`Se han insertado ${provinces.length} provincias en la colección 'location'.`);
}