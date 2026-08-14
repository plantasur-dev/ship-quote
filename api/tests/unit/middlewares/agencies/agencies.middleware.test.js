
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

    it('lanza 400 si el name es requerido (normalizeString -> null)', async () => {
        const req = buildReq({ type: 'api' });

        await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'Name agency is required',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('lanza 400 si el name tiene menos de 3 caracteres', async () => {
        const req = buildReq({ name: 'ab', type: 'api' });

        await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'Name agency must be between 3 and 14 characters',
        });
    });

    it('lanza 400 si el name tiene más de 14 caracteres', async () => {
        const req = buildReq({ name: 'a'.repeat(15), type: 'api' });

        await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'Name agency must be between 3 and 14 characters',
        });
    });

    it('lanza 400 si active viene y no es boolean', async () => {
        const req = buildReq({ name: 'Valid Name', type: 'static', active: 'yes' });

        await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'active must be boolean',
        });
    });

    it('no falla por active cuando es false (comportamiento actual del middleware)', async () => {
        // Nota: `active && typeof active !== 'boolean'` no evalúa la rama cuando active es falsy.
        const req = buildReq({ name: 'Valid Name', type: 'static', active: false });

        await agenciesValidation(req, {}, next);

        expect(next).toHaveBeenCalledOnce();
    });

    it('lanza 400 si el type es requerido (normalizeString -> null)', async () => {
        const req = buildReq({ name: 'Valid Name' });

        await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'Type agency is required',
        });
    });

    it('lanza 400 si el type no está en la lista permitida', async () => {
        const req = buildReq({ name: 'Valid Name', type: 'invalid-type' });

        await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'type must be one of: api, static, hybrid',
        });
    });

    it('llama a validateRules y validateSupplements con los valores del body', async () => {
        const req = buildReq({
            name: 'Valid Name',
            type: 'static',
            rules: ['r1'],
            supplements: ['s1'],
        });

        await agenciesValidation(req, {}, next);

        expect(validateRules).toHaveBeenCalledWith(['r1']);
        expect(validateSupplements).toHaveBeenCalledWith(['s1']);
        expect(next).toHaveBeenCalledOnce();
    });

    it('propaga el error si validateRules lanza', async () => {
        validateRules.mockImplementation(() => {
            throw Object.assign(new Error('rules inválidas'), { status: 400 });
        });
        const req = buildReq({ name: 'Valid Name', type: 'static' });

        await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'rules inválidas',
        });
        expect(next).not.toHaveBeenCalled();
    });

    describe('cuando el type requiere apiConfig (api / hybrid)', () => {
        
        it('lanza 400 si falta baseUrlApi', async () => {
            const req = buildReq({
                name: 'Valid Name',
                type: 'api',
                apiConfig: { 
                    apiKey: 'Pruebas'
                }
            });

            await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
                status: 400,
                message: 'baseUrlApi is required for agencies of type API or hybrid',
            });
        });

        it('lanza 400 si baseUrlApi no es string', async () => {
            const req = buildReq({
                name: 'Valid Name',
                type: 'api',
                apiConfig: { baseUrlApi: 123, apiKey: 'key123' },
            });

            await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
                status: 400,
                message: 'baseUrlApi is required for agencies of type API or hybrid',
            });
        });

        it('lanza 400 si falta apiKey', async () => {
            const req = buildReq({
                name: 'Valid Name',
                type: 'hybrid',
                apiConfig: { baseUrlApi: 'https://example.com' },
            });

            await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
                status: 400,
                message: 'apiKey is required for agencies of type API or hybrid',
            });
        });

        it('lanza 400 si baseUrlApi no es una URL válida', async () => {
            vi.spyOn(URL, 'canParse').mockReturnValue(false);
            const req = buildReq({
                name: 'Valid Name',
                type: 'api',
                apiConfig: { baseUrlApi: 'not-a-url', apiKey: 'key123' },
            });

            await expect(agenciesValidation(req, {}, next)).rejects.toMatchObject({
                status: 400,
                message: 'baseUrlApi is not valid',
            });
        });

        it('pasa validación con apiConfig completo y válido (type api)', async () => {
            vi.spyOn(URL, 'canParse').mockReturnValue(true);
            const req = buildReq({
                name: 'Valid Name',
                type: 'API',
                apiConfig: { baseUrlApi: 'https://example.com', apiKey: 'key123' },
            });

            await agenciesValidation(req, {}, next);

            expect(next).toHaveBeenCalledOnce();
            expect(req.body.type).toBe('api');
        });

        it('pasa validación con apiConfig completo y válido (type hybrid)', async () => {
            vi.spyOn(URL, 'canParse').mockReturnValue(true);
            const req = buildReq({
                name: 'Valid Name',
                type: 'Hybrid',
                apiConfig: { baseUrlApi: 'https://example.com', apiKey: 'key123' },
            });

            await agenciesValidation(req, {}, next);

            expect(next).toHaveBeenCalledOnce();
            expect(req.body.type).toBe('hybrid');
        });
    });

    it('no exige apiConfig cuando el type es static', async () => {
        const req = buildReq({ name: 'Valid Name', type: 'static' });

        await agenciesValidation(req, {}, next);

        expect(next).toHaveBeenCalledOnce();
        expect(req.body.type).toBe('static');
    });

    it('normaliza el type a minúsculas en req.body', async () => {
        const req = buildReq({ name: 'Valid Name', type: 'STATIC' });

        await agenciesValidation(req, {}, next);

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

    it('lanza 400 si active no es boolean', async () => {
        const req = buildReq({ active: 'true', type: 'static' });

        await expect(updateAgenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'active must be boolean',
        });
    });

    it('lanza 400 si active falta (undefined no es boolean)', async () => {
        const req = buildReq({ type: 'static' });

        await expect(updateAgenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'active must be boolean',
        });
    });

    it('lanza 400 si el type falta', async () => {
        const req = buildReq({ active: true });

        await expect(updateAgenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'type are required fields',
        });
    });

    it('lanza 400 si el type no es válido', async () => {
        const req = buildReq({ active: true, type: 'foo' });

        await expect(updateAgenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'type must be one of: api, static, hybrid',
        });
    });

    it('llama a validateRules, validateSupplements y validateApiConfig con los valores esperados', async () => {
        const req = buildReq({
            active: true,
            type: 'API',
            rules: ['r1'],
            supplements: ['s1'],
            apiConfig: { baseUrlApi: 'https://example.com', apiKey: 'k' },
        });

        await updateAgenciesValidation(req, {}, next);

        expect(validateRules).toHaveBeenCalledWith(['r1']);
        expect(validateSupplements).toHaveBeenCalledWith(['s1']);
        expect(validateApiConfig).toHaveBeenCalledWith('api', {
            baseUrlApi: 'https://example.com',
            apiKey: 'k',
        });
        expect(next).toHaveBeenCalledOnce();
    });

    it('propaga el error si validateApiConfig lanza', async () => {
        validateApiConfig.mockImplementation(() => {
            throw Object.assign(new Error('apiConfig inválido'), { status: 400 });
        });
        const req = buildReq({ active: true, type: 'api', apiConfig: {} });

        await expect(updateAgenciesValidation(req, {}, next)).rejects.toMatchObject({
            status: 400,
            message: 'apiConfig inválido',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('elimina apiConfig del body cuando el type es static', async () => {
        const req = buildReq({
            active: true,
            type: 'STATIC',
            apiConfig: { baseUrlApi: 'https://example.com', apiKey: 'k' },
        });

        await updateAgenciesValidation(req, {}, next);

        expect(req.body.apiConfig).toBeUndefined();
        expect(req.body.type).toBe('static');
        expect(next).toHaveBeenCalledOnce();
    });

    it('conserva apiConfig cuando el type es api o hybrid', async () => {
        const req = buildReq({
            active: true,
            type: 'hybrid',
            apiConfig: { baseUrlApi: 'https://example.com', apiKey: 'k' },
        });

        await updateAgenciesValidation(req, {}, next);

        expect(req.body.apiConfig).toEqual({
            baseUrlApi: 'https://example.com',
            apiKey: 'k',
        });
        expect(req.body.type).toBe('hybrid');
    });

    it('normaliza el type a minúsculas en req.body', async () => {
        const req = buildReq({ active: true, type: 'Static' });

        await updateAgenciesValidation(req, {}, next);

        expect(req.body.type).toBe('static');
    });
});