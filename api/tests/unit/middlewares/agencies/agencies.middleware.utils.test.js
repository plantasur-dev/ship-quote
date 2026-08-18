
vi.mock('../../../../lib/constants/index.js', () => ({
    SCOPE_TYPES: {
        NATIONAL: 'national',
        INTERNATIONAL: 'international',
    },
    SCOPE_TYPES_ARRAY: ['national', 'international']
}));

vi.mock('../../../../src/lib/utils/middleware/middleware.utils.js', () => ({
    normalizeString: vi.fn(),
    missingFields: vi.fn(),
    unknownFields: vi.fn()
}));

import {
    validateRules,
    validateSupplements,
    validateApiConfig,
} from '../../../../src/lib/utils/middleware/agencies.middleware.utils.js';

import { 
    normalizeString,
    unknownFields,
    missingFields
 } from '../../../../src/lib/utils/middleware/middleware.utils.js';

const defaultNormalize = (value) => {
    if (value === undefined || value === null) return null;
    const trimmed = String(value).trim();
    return trimmed.length === 0 ? null : trimmed;
};

const buildReq = (body) => ({ body });

describe('validateRules', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        normalizeString.mockImplementation(defaultNormalize);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lanza 400 si rules no es un objeto', async () => {
        const req = buildReq({ rules: 'not valid' });

        expect(() => validateRules(req.body.rules)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Must be an object',
            })
        );    
    });

    it('lanza 400 si parametros hasAndaluciaRule, supportsPallets y supportsParcels', () => {
        const req = buildReq({ 
            rules: {
                hasAndaluciaRule: 'not-valid',
                supportsPallets: 'not-valid',
                supportsParcels: 'not-valid'
            }
        });

        expect(() => validateRules(req.body.rules)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Fields supportsPallets, supportsParcels and hasAndaluciaRule must be an Boolean'
            })
        );
    });

    it('lanza 400 si coverage no es un array de string', () => {
        const req = buildReq({
            rules: {
                hasAndaluciaRule: false,
                supportsPallets: true,
                supportsParcels: false,
                coverage: {}
            }
        });

        expect(() => validateRules(req.body.rules)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Coverage must be a non-empty array of strings'
            })
        );
    });

    it('lanza 400 si coverage un array vacío', () => {
        const req = buildReq({
            rules: {
                hasAndaluciaRule: false,
                supportsPallets: true,
                supportsParcels: false,
                coverage: []
            }
        });

        expect(() => validateRules(req.body.rules)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Coverage must be a non-empty array of strings'
            })
        );
    });

    it('lanza 400 si los valores que contiene coverage son invalidos', () => {
        const req = buildReq({
            rules: {
                hasAndaluciaRule: false,
                supportsPallets: true,
                supportsParcels: false,
                coverage: ['not-valid']
            }
        });

        expect(() => validateRules(req.body.rules)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: `rules.coverage contains invalid values: not-valid. Must be one of: national or international.`
            })
        );
    });
});

describe('validateSupplements', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        normalizeString.mockImplementation(defaultNormalize);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lanza 400 si el supplemts de fuelSurcharge no contiene type no contiene', () => {
        const req = buildReq({ 
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: null
                } 
            }
        });

        expect(() => validateSupplements(req.body.supplements)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'type surcharge is required',
            })
        );    
    });

    it('lanza 400 si type de fuelSurcharge contiene un valor no valido', () => {
        const req = buildReq({ 
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: 'not-valid'
                } 
            }
        });

        expect(() => validateSupplements(req.body.supplements)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Type surcharge fuel must be one of: percentage, fixed',
            })
        );
    });

    it('no lanza error si value de fuelSurcharge es undefined', () => {
        const req = buildReq({ 
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: 'fixed'
                } 
            }
        });

        expect(() => validateSupplements(req.body.supplements)).not.toThrow();
    });

    it('lanza 400 si value de fuelSurcharge no es number', () => {
        const req = buildReq({ 
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: 'fixed',
                    value: 'not-valid'
                } 
            }
        });

        expect(() => validateSupplements(req.body.supplements)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'The surcharge value must be a positive number',
            })
        );
    });

    it('lanza 400 si value de fuelSurcharge si no es positivo', () => {
        const req = buildReq({ 
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: 'fixed',
                    value: -1
                } 
            }
        });

        expect(() => validateSupplements(req.body.supplements)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'The surcharge value must be a positive number',
            })
        );
    });

    it('lanza 400 si el type de Surcharge es igual a percentage y value es mayor de 100', () => {
        const req = buildReq({ 
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: 'percentage',
                    value: 999
                } 
            }
        });

        expect(() => validateSupplements(req.body.supplements)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'The surcharge percentage cannot exceed 100%',
            })
        );
    });
});

describe('validateApiConfig', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        normalizeString.mockImplementation(defaultNormalize);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lanza 400 si apiConfig.timeout no es number', () => {
        const req = buildReq({ apiConfig: { timeout: 'not-valid' } });

        expect(() => validateApiConfig('api', req.body.apiConfig)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Fields timeout must be an number',
            })
        );
    });

    it('lanza 400 si apiConfig.baseUrlApi no es string', () => {
        const req = buildReq({ apiConfig: { timeout: 3000, baseUrlApi: null } });

        expect(() => validateApiConfig('api', req.body.apiConfig)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Fields baseUrlApi and apiKey must be an string',
            })
        );
    });

    it('lanza 400 si apiConfig.apiKey no es string', () => {
        const req = buildReq({ apiConfig: { timeout: 3000, baseUrlApi: 'base.url', apiKey: null } });

        expect(() => validateApiConfig('api', req.body.apiConfig)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Fields baseUrlApi and apiKey must be an string',
            })
        );
    });

    it('lanza 400 si apiConfig.endpoints no es array', () => {
        const req = buildReq({ 
            apiConfig: {
                timeout: 3000,
                baseUrlApi: 'base.url',
                endpoints: null,
                apiKey: 'aaaaaaaa',
            }
        });

        expect(() => validateApiConfig('api', req.body.apiConfig)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Fields endpoints must be an object of strings',
            })
        );
    });

});