
import mongoose from "mongoose";

import Location from '../../lib/models/location.model.js';

import logger from '../../lib/logger/logger.js';

import { 
    provincesData, 
    specialIslands 
} from '../../lib/data/location.js';

let provincesMap = {};

let provincesAll = [];

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
            countryCode: p.countryCode,
            countryName: p.countryName,
            adminCode: p.adminCode,
            adminFullCode: `${p.countryCode}-${p.adminCode}`,
            name: p.name,
            normalizedName: normalizeName(p.name),
            postalCode: p.postalCode,
            type: "province"
        });
    });

    return provinces;
}

export const initProvinces = async () => {
    
    const checkData = await Location.exists({});
    if (checkData) {
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

    const result = await Location.insertMany(locationsAll);
    
    if (!result){
        logger.error({
            event: 'locations:bootstrap:error',
            message: `Se ha producido un error en la carga de provincias.`,
            component: 'database'
        });
        return;
    }

    logger.info({
        event: 'locations:bootstrap:success',
        message: `Se han insertado ${ locationsAll.length } provincias en la colección 'locations'.`,
        component: 'database'
    });
}

export async function loadProvinces() {
    provincesAll = await Location.find().lean();
    
    provincesMap = {
        provinceByCountryCodeAndPostalCode: new Map(
        provincesAll.map(province => [
            `${province.countryCode}-${province.postalCode}`,
            province
        ])
    )};
}

export function getProvinceByCountryCodeAndPostalCode(
    countryCode, 
    postalCode
) {
    return provincesMap
        .provinceByCountryCodeAndPostalCode
        .get(`${countryCode}-${postalCode.slice(0, 2)}`);
}

export function getProvinces() {
    return provincesAll;
}