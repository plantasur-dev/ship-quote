
import Agency from '../../../src/lib/models/agency.model.js';

import { getScope, SCOPE_LABELS } from '../../../src/lib/constants/scopes.zone.js';

import rates from '../../../src/api/services/rates.service.js';
import { getStaticRates, getApiRates } from '../../../src/api/services/rates/index.js';

vi.mock('../../../src/lib/models/agency.model.js', () => ({
    default: {
        find: vi.fn()
    }
}));

vi.mock('../../../src/lib/constants/scopes.zone.js', () => ({
    getScope: vi.fn(),
    SCOPE_LABELS: {
        national: 'NACIONAL',
        international: 'INTERNACIONAL'
    }
}));

vi.mock('../../../src/api/services/rates/index.js', () => ({
    getStaticRates: vi.fn(),
    getApiRates: vi.fn()
}));

const input = {
    countryCode: 'ES',
    destinationPostalCode: '28001',
    items: []
};

/**
 * `rates.service.js` es ahora el único sitio que calcula `scope`/`zone`
 * a partir de `input.countryCode`, y los propaga explícitamente a
 * `getStaticRates`/`getApiRates` como parte de un `enrichedInput`. Antes
 * se pasaba el `input` tal cual, y cada provider (o, peor, el propio
 * domain leyendo `process.env`) volvía a calcular el scope por su
 * cuenta.
 */
describe('rates service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return combined static + api results, forwarding scope and zone to both providers', async () => {
        getScope.mockReturnValue('national');

        Agency.find.mockResolvedValue([
            { type: 'static' },
            { type: 'hybrid' },
            { type: 'api' }
        ]);

        getStaticRates.mockResolvedValue([
            { agency: 'DHL', price: 10 }
        ]);

        getApiRates.mockResolvedValue([
            { agency: 'UPS', price: 12 }
        ]);

        const result = await rates(input);

        expect(Agency.find).toHaveBeenCalledWith({
            active: { $ne: false },
            'rules.coverage': 'national'
        });

        const enrichedInput = {
            ...input,
            scope: 'national',
            zone: 'NACIONAL'
        };

        expect(getStaticRates).toHaveBeenCalledWith(
            [
                { type: 'static' },
                { type: 'hybrid' }
            ],
            enrichedInput
        );

        expect(getApiRates).toHaveBeenCalledWith(
            [
                { type: 'api' }
            ],
            enrichedInput
        );

        expect(result).toEqual([
            { agency: 'DHL', price: 10 },
            { agency: 'UPS', price: 12 }
        ]);
    });

    it('should return empty array when no agencies found', async () => {
        getScope.mockReturnValue('national');

        Agency.find.mockResolvedValue([]);

        getStaticRates.mockResolvedValue([]);
        getApiRates.mockResolvedValue([]);

        const result = await rates(input);

        expect(result).toEqual([]);
    });

    it('should call only static rates when no api agencies', async () => {
        getScope.mockReturnValue('national');

        Agency.find.mockResolvedValue([
            { type: 'static' },
            { type: 'hybrid' }
        ]);

        getStaticRates.mockResolvedValue([
            { agency: 'DHL', price: 10 }
        ]);

        getApiRates.mockResolvedValue([]);

        const result = await rates(input);

        expect(getStaticRates).toHaveBeenCalledTimes(1);
        expect(getApiRates).toHaveBeenCalledTimes(1);

        expect(result).toEqual([{ agency: 'DHL', price: 10 }]);
    });

    it('should call only api rates when only api agencies exist', async () => {
        getScope.mockReturnValue('national');

        Agency.find.mockResolvedValue([
            { type: 'api' }
        ]);

        getStaticRates.mockResolvedValue([]);
        getApiRates.mockResolvedValue([
            { agency: 'UPS', price: 15 }
        ]);

        const result = await rates(input);

        const enrichedInput = {
            ...input,
            scope: 'national',
            zone: 'NACIONAL'
        };

        expect(getStaticRates).toHaveBeenCalledWith([], enrichedInput);
        expect(getApiRates).toHaveBeenCalledWith([{ type: 'api' }], enrichedInput);

        expect(result).toEqual([{ agency: 'UPS', price: 15 }]);
    });

    it('should use getScope with countryCode', async () => {
        getScope.mockReturnValue('national');

        Agency.find.mockResolvedValue([]);

        await rates(input);

        expect(getScope).toHaveBeenCalledWith('ES');
    });

    it('should resolve the international zone label when scope is international', async () => {
        getScope.mockReturnValue('international');

        Agency.find.mockResolvedValue([{ type: 'api' }]);

        getApiRates.mockResolvedValue([]);

        await rates({ ...input, countryCode: 'FR' });

        expect(getApiRates).toHaveBeenCalledWith(
            [{ type: 'api' }],
            { ...input, countryCode: 'FR', scope: 'international', zone: 'INTERNACIONAL' }
        );
    });
});
