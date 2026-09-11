
vi.mock('../../../../lib/constants/index.js', () => ({
    AGENCY_TYPE: {
        API: 'api',
        HYBRID: 'hybrid',
        STATIC: 'static',
    },
    agencyTypeToArray: ['api', 'hybrid', 'static'],
}));

vi.mock('../../../../src/lib/utils/middleware/agencies.middleware.utils.js', () => ({
    validateRules: vi.fn(),
    validateSupplements: vi.fn(),
    validateApiConfig: vi.fn(),
}));

vi.mock('../../../../src/lib/utils/middleware/middleware.utils.js', () => ({
    normalizeString: vi.fn(),
}));

import {
    agenciesValidation,
    updateAgenciesValidation,
} from '../../../../src/api/middlewares/agencies.validation.middleware.js';

import {
    validateRules,
    validateSupplements,
    validateApiConfig,
} from '../../../../src/lib/utils/middleware/agencies.middleware.utils.js';

import { normalizeString } from '../../../../src/lib/utils/middleware/middleware.utils.js';

const defaultNormalize = (value) => {
    if (value === undefined || value === null) return null;
    const trimmed = String(value).trim();
    return trimmed.length === 0 ? null : trimmed;
};

const buildReq = (body) => ({ body });

describe('agenciesValidation', () => {
    let next;

    beforeEach(() => {
        vi.resetAllMocks();
        next = vi.fn();
        normalizeString.mockImplementation(defaultNormalize);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lanza 400 si name es requerido (normalizeString -> null)', () => {
        const req = buildReq({ type: 'api' });

        expect(() => agenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Name agency is required',
            })
        );
       
    });

    it('lanza 400 si name tiene menos de 3 caracteres', () => {
        const req = buildReq({ name: 'ab', type: 'api' });

        expect(() => agenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Name agency must be between 3 and 14 characters',
            })
        );
    });

    it('lanza 400 si name tiene más de 14 caracteres', () => {
        const req = buildReq({ name: 'a'.repeat(15), type: 'api' });

        expect(() => agenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Name agency must be between 3 and 14 characters',
            })
        );
    });

    it('lanza 400 si active viene y no es boolean', () => {
        const req = buildReq({ name: 'Valid Name', type: 'static', active: 'yes' });

        expect(() => agenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'active must be boolean',
            })
        );
    });

    it('lanza 400 si type es requerido (normalizeString -> null)', () => {
        const req = buildReq({ name: 'Valid Name', active: true });

        expect(() => agenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Type agency is required'
            })
        );
    });

    it('lanza 400 si type no está en la lista permitida', () => {
        const req = buildReq({ name: 'Valid Name', type: 'invalid-type', active: true });

        expect(() => agenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'type must be one of: api, static, hybrid',
            })
        );
    });

    it('llama a validateRules y validateSupplements con los valores del body', () => {
        const req = buildReq({
            name: 'Valid Name',
            active: true,
            type: 'static',
            rules: ['r1'],
            supplements: ['s1'],
        });

        agenciesValidation(req, {}, next);

        expect(validateRules).toHaveBeenCalledWith(['r1']);
        expect(validateSupplements).toHaveBeenCalledWith(['s1']);
        expect(next).toHaveBeenCalledOnce();
    });

    it('propaga el error si validateRules lanza', () => {
        validateRules.mockImplementation(() => {
            throw Object.assign(new Error('rules inválidas'), { status: 400 });
        });
        const req = buildReq({ name: 'Valid Name', type: 'static', active: true });

        expect(() => agenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'rules inválidas',
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('lanza un 400 cuando type es API o HYBRID y apiConfig es requerido', () => {
        const req = buildReq({ name: 'Valid Name', type: 'api', active: true });

        expect(() => agenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'apiConfig is required for agencies of type API or hybrid',
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('no exige apiConfig cuando type es static', () => {
        const req = buildReq({ name: 'Valid Name', type: 'static', active: true });

        agenciesValidation(req, {}, next);

        expect(next).toHaveBeenCalledOnce();
        expect(req.body.type).toBe('static');
    });

    it('normaliza type a minúsculas en req.body', () => {
        const req = buildReq({ name: 'Valid Name', type: 'STATIC', active: true });

        agenciesValidation(req, {}, next);

        expect(req.body.type).toBe('static');
    });
});

describe('updateAgenciesValidation', () => {
    let next;

    beforeEach(() => {
        vi.resetAllMocks();
        next = vi.fn();
        normalizeString.mockImplementation(defaultNormalize);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lanza 400 si active no es boolean', () => {
        const req = buildReq({ active: 'true', type: 'static' });

        expect(() => updateAgenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'active must be boolean',
            })
        );
    });

    it('lanza 400 si active falta (undefined no es boolean)', () => {
        const req = buildReq({ type: 'static' });

        expect(() => updateAgenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'active must be boolean',
            })
        );
    });

    it('lanza 400 si type falta', () => {
        const req = buildReq({ active: true });

        expect(() => updateAgenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'type are required fields',
            })
        );
    });

    it('lanza 400 si type no es válido', () => {
        const req = buildReq({ active: true, type: 'foo' });

        expect(() => updateAgenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'type must be one of: api, static, hybrid',
            })
        );
    });

    it('llama a validateRules, validateSupplements y validateApiConfig con los valores esperados', () => {
        const req = buildReq({
            active: true,
            type: 'API',
            rules: ['r1'],
            supplements: ['s1'],
            apiConfig: { baseUrlApi: 'https://example.com', apiKey: 'k' },
        });

        updateAgenciesValidation(req, {}, next);

        expect(validateRules).toHaveBeenCalledWith(['r1']);
        expect(validateSupplements).toHaveBeenCalledWith(['s1']);
        expect(validateApiConfig).toHaveBeenCalledWith('api', {
            baseUrlApi: 'https://example.com',
            apiKey: 'k',
        });
        expect(next).toHaveBeenCalledOnce();
    });

    it('propaga el error si validateApiConfig lanza', () => {
        validateApiConfig.mockImplementation(() => {
            throw Object.assign(new Error('apiConfig inválido'), { status: 400 });
        });
        const req = buildReq({ active: true, type: 'api', apiConfig: {} });

        expect(() => updateAgenciesValidation(req, {}, next)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'apiConfig inválido',
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('elimina apiConfig del body cuando type es static', () => {
        const req = buildReq({
            active: true,
            type: 'STATIC',
            apiConfig: { baseUrlApi: 'https://example.com', apiKey: 'k' },
        });

        updateAgenciesValidation(req, {}, next);

        expect(req.body.apiConfig).toBeUndefined();
        expect(req.body.type).toBe('static');
        expect(next).toHaveBeenCalledOnce();
    });

    it('conserva apiConfig cuando type es api o hybrid', () => {
        const req = buildReq({
            active: true,
            type: 'hybrid',
            apiConfig: { baseUrlApi: 'https://example.com', apiKey: 'k' },
        });

        updateAgenciesValidation(req, {}, next);

        expect(req.body.apiConfig).toEqual({
            baseUrlApi: 'https://example.com',
            apiKey: 'k',
        });
        expect(req.body.type).toBe('hybrid');
    });

    it('normaliza type a minúsculas en req.body', () => {
        const req = buildReq({ active: true, type: 'Static' });

        updateAgenciesValidation(req, {}, next);

        expect(req.body.type).toBe('static');
    });
});