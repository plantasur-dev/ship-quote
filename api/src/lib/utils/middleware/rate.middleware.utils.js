
import createHttpError from 'http-errors';

import { 
    SERVICE_NAMES, 
    SHIPMENT_UNIT_VALUES 
} from '../../constants/index.js';

import { 
    normalizeString, 
    isInvalidNumber 
} from './middleware.utils.js';

export const validateItem = (item, index) => {
    const errors = [];

    if (item == null || typeof item !== 'object' || Array.isArray(item)) {
        throw createHttpError(400, `Item ${ index + 1 }: must be an object`);
    }

    const normalizedTypeServices = normalizeString(item.typeServices);

    if (normalizedTypeServices == null) {
        errors.push('typeServices is required');
    } else {
        const loweredTypeServices = normalizedTypeServices.toLowerCase();

        if (!SHIPMENT_UNIT_VALUES.includes(loweredTypeServices)) {
            errors.push('typeServices unknown');
        } else {
            item.typeServices = loweredTypeServices;
        }
    }

    if (isInvalidNumber(item.weight)) {
        errors.push('weight must be a number > 0');
    }

    if (isInvalidNumber(item.large)) {
        errors.push('large must be a number > 0');
    }

    if (isInvalidNumber(item.width)) {
        errors.push('width must be a number > 0');
    }

    if (isInvalidNumber(item.height)) {
        errors.push('height must be a number > 0');
    }

    if (errors.length) {
        throw createHttpError(400, `Item ${ index + 1 }: ${ errors.join(', ') }`);
    }
};

const validatePriceBreaks = (priceBreaks, index) => {
    if (!Array.isArray(priceBreaks) || priceBreaks.length === 0) {
        throw createHttpError(400, `services[${ index }].priceBreaks must be a non-empty array`);
    }

    priceBreaks.forEach((range, rangeIndex) => {
        if (range == null || typeof range !== 'object' || Array.isArray(range)) {
            throw createHttpError(400, `services[${ index }].priceBreaks[${ rangeIndex }] must be an object`);
        }

        if (isInvalidNumber(range.min, { allowZero: true })) {
            throw createHttpError(400, `services[${ index }].priceBreaks[${ rangeIndex }].min must be a number >= 0`);
        }

        if (isInvalidNumber(range.max)) {
            throw createHttpError(400, `services[${ index }].priceBreaks[${ rangeIndex }].max must be a number > 0`);
        }

        if (range.max < range.min) {
            throw createHttpError(400, `services[${ index }].priceBreaks[${ rangeIndex }].max cannot be lower than min`);
        }

        if (isInvalidNumber(range.price)) {
            throw createHttpError(400, `services[${ index }].priceBreaks[${ rangeIndex }].price must be a number > 0`);
        }
    });
};

export const validateService = (service, index) => {
    if (service == null || typeof service !== 'object' || Array.isArray(service)) {
        throw createHttpError(400, `services[${ index }] must be an object`);
    }

    const normalizedServiceName = normalizeString(service.service);

    if (normalizedServiceName != null) {
        const loweredService = normalizedServiceName.toLowerCase();

        if (!SERVICE_NAMES.includes(loweredService)) {
            throw createHttpError(400, `services[${ index }].service must be one of: ${ SERVICE_NAMES.join(', ') }`);
        }

        service.service = loweredService;
    }

    validatePriceBreaks(service.priceBreaks, index);

    if (service.fallbackToLastPrice != null && typeof service.fallbackToLastPrice !== 'boolean') {
        throw createHttpError(400, `services[${ index }].fallbackToLastPrice must be a boolean`);
    }
};