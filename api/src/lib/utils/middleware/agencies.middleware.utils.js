
import createHttpError from "http-errors";

import { 
    AGENCY_TYPE, 
    SCOPE_TYPES,
    SCOPE_TYPES_ARRAY 
} from "../../constants/index.js";

import { 
    unknownFields,
    missingFields,
    normalizeString
} from "./middleware.utils.js";

export const validateRules = (rules) => {
    
    if (rules) {
        if (typeof rules !== 'object' || Array.isArray(rules)) {
            throw createHttpError(400, 'Must be an object');
        }

        const { hasAndaluciaRule, supportsPallets, supportsParcels, coverage } = rules;

        const allowedFieldsRules = ['hasAndaluciaRule', 'supportsPallets', 'supportsParcels', 'coverage'];

        unknownFields(rules , allowedFieldsRules);

        missingFields('rules', rules , allowedFieldsRules);

        if (typeof hasAndaluciaRule !== 'boolean' || 
            typeof supportsPallets !== 'boolean' ||
            typeof supportsParcels !== 'boolean'
        ) {
            throw createHttpError(400, `Fields supportsPallets, supportsParcels and hasAndaluciaRule must be an Boolean`); 
        }

        if (!Array.isArray(coverage) || 
            coverage.length === 0 ||
            !coverage.every(item => typeof item === 'string')
        ) {
            throw createHttpError(400, 'Coverage must be a non-empty array of strings'); 
        }

        const invalidValues = coverage.filter(c => !Object.values(SCOPE_TYPES).includes(c));

        if (invalidValues.length > 0) {
            throw createHttpError(400, `rules.coverage contains invalid values: ${ invalidValues.join(', ') }. Must be one of: ${ SCOPE_TYPES_ARRAY.join(' or ') }.`);
        }
    }
};

export const validateSupplements = (supplements) => {

    if (supplements) {
        const allowedFieldsSupplements = ['fuelSurcharge'];

        unknownFields(supplements , allowedFieldsSupplements);

        if (supplements.fuelSurcharge && supplements.fuelSurcharge.enabled === true) {

            const { type: surchargeType, value } = supplements.fuelSurcharge;

            const normalizedSurchargeType = normalizeString(surchargeType);
            
            if (normalizedSurchargeType === null) {
                throw createHttpError(400, 'type surcharge is required');
            }

            const loweredSurchargeType = normalizedSurchargeType.toLowerCase();

            if (!['percentage', 'fixed'].includes(loweredSurchargeType)) {
                throw createHttpError(400, `Type surcharge fuel must be one of: ${ ['percentage', 'fixed'].join(', ') }`)
            }
    
            if (value !== undefined && (typeof value !== 'number' || value < 0)) {
                throw createHttpError(400, 'The surcharge value must be a positive number');
            }

            if (loweredSurchargeType === 'percentage' && value > 100) {
                throw createHttpError(400, 'The surcharge percentage cannot exceed 100%');
            }
    
            supplements.fuelSurcharge.type = loweredSurchargeType;
        }
    }
};

export const validateApiConfig = (type, apiConfig) => {

    const requiresApiConfig = type === AGENCY_TYPE.API || type === AGENCY_TYPE.HYBRID;

    if (requiresApiConfig && apiConfig) {
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