
export const SCOPE_TYPES = {
    NATIONAL: 'national',
    INTERNATIONAL: 'international'
};

export const SCOPE_LABELS = {
    [SCOPE_TYPES.NATIONAL]: 'NACIONAL',
    [SCOPE_TYPES.INTERNATIONAL]: 'INTERNACIONAL'
};

export function getScope(countryCode) {    
    return countryCode === process.env.DEFAULT_COUNTRY 
        ? SCOPE_TYPES.NATIONAL 
        : SCOPE_TYPES.INTERNATIONAL;
}

export const SCOPE_TYPES_ARRAY = Object.values(SCOPE_TYPES);
