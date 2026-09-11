
import createHttpError from "http-errors";
import { 
    AGENCY_TYPE, 
    AGENCY_TYPE_ARRAY 
} from "../../lib/constants/index.js";
import { 
    validateRules, 
    validateSupplements,
    validateApiConfig
} from "../../lib/utils/middleware/agencies.middleware.utils.js";
import { normalizeString} from "../../lib/utils/middleware/middleware.utils.js";

export const agenciesValidation = (req, res, next) => {

    const { active, name, type, apiConfig, supplements, rules } = req.body;

    const normalizedName = normalizeString(name);

    if (normalizedName === null) {
        throw createHttpError(400, 'Name agency is required');
    }
   
    if (normalizedName.length < 3 || normalizedName.length > 14) {
        throw createHttpError(400, 'Name agency must be between 3 and 14 characters');
    }
 
    if (typeof active !== 'boolean') {
        throw createHttpError(400, 'active must be boolean');
    }

    const normalizedType = normalizeString(type);

    if (normalizedType === null) {
        throw createHttpError(400, 'Type agency is required');
    }

    const loweredType = normalizedType.toLowerCase();

    if (!AGENCY_TYPE_ARRAY.includes(loweredType)) {
        throw createHttpError(400, `type must be one of: ${ AGENCY_TYPE_ARRAY.join(', ') }`);
    }

    validateRules(rules);

    validateSupplements(supplements);

    const requiresApiConfig = loweredType === AGENCY_TYPE.API || loweredType === AGENCY_TYPE.HYBRID;

    if (requiresApiConfig && !apiConfig) {
        throw createHttpError(400, 'apiConfig is required for agencies of type API or hybrid');
    }
        
    validateApiConfig(loweredType, apiConfig);
    
    req.body.type = loweredType;

    next();       
};

export const updateAgenciesValidation = (req, res, next) => {
    
    const { active, type, rules, supplements, apiConfig } = req.body;
    
    if (typeof active !== 'boolean') {
        throw createHttpError(400, 'active must be boolean');
    }

    const normalizedType = normalizeString(type);

    if (normalizedType === null) {
        throw createHttpError(400, 'type are required fields');
    }

    const loweredType = normalizedType.toLowerCase()

    if (!AGENCY_TYPE_ARRAY.includes(loweredType)) {
        throw createHttpError(400, `type must be one of: ${ AGENCY_TYPE_ARRAY.join(', ') }`);
    }

    validateRules(rules);

    validateSupplements(supplements);

    validateApiConfig(loweredType, apiConfig);

    if (loweredType === AGENCY_TYPE.STATIC) {
        delete req.body.apiConfig;
    }

    req.body.type = loweredType;

    next();
};