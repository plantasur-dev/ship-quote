
import createHttpError from "http-errors";

import { AGENCY_TYPE } from "../../constants/index.js";

import { 
    unknownFields,
    missingFields
} from "./middleware.utils.js";

export const validateRules = (rules) => {
    
    if (rules) {
        const allowedFieldsRules = ['hasAndaluciaRule', 'supportsPallets', 'supportsParcels', 'coverage'];

        unknownFields(rules , allowedFieldsRules);

        missingFields('rules', rules , allowedFieldsRules);

        if (typeof rules.hasAndaluciaRule !== 'boolean' || 
            typeof rules.supportsPallets !== 'boolean' ||
            typeof rules.supportsParcels !== 'boolean'
        ) {
            throw createHttpError(400, `Fields supportsPallets, supportsParcels and hasAndaluciaRule must be an Boolean`); 
        }

        if (!Array.isArray(rules.coverage) || 
            rules.coverage.length === 0 ||
            !rules.coverage.every(item => typeof item === 'string')
        ) {
            throw createHttpError(400, 'Coverage must be a non-empty array of strings'); 
        }
        
    }
};

export const validateSupplements = (supplements) => {

    if (supplements) {
        const allowedFieldsSupplements = ['fuelSurcharge'];

        unknownFields(supplements , allowedFieldsSupplements);

        const { fuelSurcharge } = supplements;

        if (fuelSurcharge && fuelSurcharge.enabled === true) {
            missingFields('fuelSurcharge', fuelSurcharge , ['type', 'value']);

            if (typeof fuelSurcharge.type !== 'string') {
                throw createHttpError(400, `Fields type must be an string`);
            }

            if (typeof fuelSurcharge.value !== 'number') {
                throw createHttpError(400, `Fields value must be an number`);
            }
        }
    }
};

export const validateApiConfig = (type, apiConfig) => {

    if (type !== AGENCY_TYPE.STATIC && apiConfig) {
        const allowedFieldsApiConfig = ['timeout', 'baseUrlApi', 'endpoints', 'apiKey'];

        unknownFields(apiConfig , allowedFieldsApiConfig);

        missingFields('apiConfig', apiConfig , allowedFieldsApiConfig);

        if (typeof apiConfig.timeout !== 'number') {
            throw createHttpError(400, `Fields timeout must be an number`);
        }

        if (typeof apiConfig.baseUrlApi !== 'string' ||
            typeof apiConfig.apiKey !== 'string'
        ) {
            throw createHttpError(400, `Fields baseUrlApi and apiKey must be an string`);
        }

        if (typeof apiConfig.endpoints !== 'object' ||
            apiConfig.endpoints === null ||
            Array.isArray(apiConfig.endpoints)
        ) {
            throw createHttpError(400, `Fields endpoints must be an object of strings`);
        }
    }
};