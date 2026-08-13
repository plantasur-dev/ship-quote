
import createHttpError from "http-errors";

import { AGENCY_TYPE } from "../../lib/constants/index.js";

import { 
    validateRules, 
    validateSupplements,
    validateApiConfig
} from "../../lib/utils/middleware/agencies.middleware.utils.js";

import { normalizeString } from "../../lib/utils/middleware/middleware.utils.js";

export const updateAgenciesValidation = async (req, res, next) => {
    
    const { active, type, rules, supplements, apiConfig } = req.body;
    
    if (typeof active !== 'boolean') {
        throw createHttpError(400, 'active must be boolean');
    }

    const normalizedType = normalizeString(type);

    if (normalizedType == null) {
        throw createHttpError(400, 'type are required fields');
    }

    validateRules(rules);

    validateSupplements(supplements);

    const loweredType = normalizedType.toLowerCase()

    const agencyTypeArray = Object.values(AGENCY_TYPE);

    if (!agencyTypeArray.includes(loweredType)) {
        throw createHttpError(400, `type must be one of: ${ agencyTypeArray.join(', ') }`);
    }

    if (loweredType === AGENCY_TYPE.STATIC) {
        delete req.body.apiConfig;
    }

    validateApiConfig(loweredType, apiConfig);

    req.body.type = loweredType;

    next();
};