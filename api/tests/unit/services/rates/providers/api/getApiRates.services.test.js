
import {
    getApiRates
} from '../../../../../../src/api/services/rates/index.js';

import {
    carrierFactory
} from '../../../../../../src/api/services/rates/providers/api/carriers/carriers.service.js';

import {
    buildStaticErrorResult,
    buildApiErrorResult,
    buildRateComplete
} from '../../../../../../src/api/services/rates/domains/build.rate.result.js';

import { presentAgencyRate } from '../../../../../../src/api/services/rates/presenters/rate.presenter.js';

/**
 * `getApiRates` ya no recalcula `scope`/`zone` a partir de
 * `input.countryCode` (eso ya no vive aquí ni depende de
 * `process.env.DEFAULT_COUNTRY`): usa directamente `input.zone`, que
 * `rates.service.js` calcula una única vez y propaga. Por eso este test
 * ya no mockea `getScope`/`SCOPE_LABELS`.
 *
 * La presentación se aplica con `presentAgencyRate` (antes `presentRate`),
 * de forma uniforme en los 4 caminos (carrier no implementado, sin
 * resultados, resultado correcto, error de carrier).
 */

vi.mock('../../../../../../src/api/services/rates/providers/api/carriers/carriers.service.js', () => ({
    carrierFactory: vi.fn()
}));

vi.mock('../../../../../../src/api/services/rates/domains/build.rate.result.js', () => ({
    buildStaticErrorResult: vi.fn(),
    buildApiErrorResult: vi.fn(),
    buildRateComplete: vi.fn()
}));

vi.mock('../../../../../../src/api/services/rates/presenters/rate.presenter.js', () => ({
    presentAgencyRate: vi.fn(result => result)
}));

describe('getApiRates', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        presentAgencyRate.mockImplementation(result => result);
    });

    it('should return complete api rate using zone from input', async () => {
        const completedRate = {
            agency: 'DHL',
            zone: 'NACIONAL',
            services: [
                { service: 'express', price: 12.5 }
            ]
        };

        const agencies = [{ name: 'DHL' }];

        const input = { countryCode: 'ES', zone: 'NACIONAL' };

        const carrier = {
            getRates: vi.fn().mockResolvedValue([1, 2])
        };

        carrierFactory.mockReturnValue(carrier);

        buildRateComplete.mockReturnValue(completedRate);

        const result = await getApiRates(agencies, input);

        expect(carrier.getRates).toHaveBeenCalledWith(input);

        expect(buildRateComplete).toHaveBeenCalledWith({
            agency: 'DHL',
            zone: 'NACIONAL',
            services: [1, 2]
        });

        expect(presentAgencyRate).toHaveBeenCalledWith(completedRate);

        expect(result).toEqual([completedRate]);
    });

    it('should return api error when carrier is missing, forwarding zone from input', async () => {

        carrierFactory.mockReturnValue(null);

        buildApiErrorResult.mockReturnValue('ERROR');

        const result = await getApiRates(
            [{ name: 'DHL' }],
            { countryCode: 'ES', zone: 'INTERNACIONAL' }
        );

        expect(buildApiErrorResult).toHaveBeenCalledWith({
            agency: 'DHL',
            zone: 'INTERNACIONAL',
            error: { message: 'Carrier not implemented' }
        });

        expect(result).toEqual(['ERROR']);
    });

    it('should return NO_RATE when empty response', async () => {

        const carrier = {
            getRates: vi.fn().mockResolvedValue([])
        };

        carrierFactory.mockReturnValue(carrier);

        buildStaticErrorResult.mockReturnValue('NO_RATE');

        const result = await getApiRates(
            [{ name: 'DHL' }],
            { countryCode: 'ES', zone: 'NACIONAL' }
        );

        expect(buildStaticErrorResult).toHaveBeenCalledWith({
            agency: 'DHL',
            zone: 'NACIONAL',
            code: 'NO_RATE'
        });

        expect(result).toEqual(['NO_RATE']);
    });

    it('should handle carrier error', async () => {

        const carrier = {
            getRates: vi.fn().mockRejectedValue(new Error('fail'))
        };

        carrierFactory.mockReturnValue(carrier);

        buildApiErrorResult.mockReturnValue('ERROR');

        const result = await getApiRates(
            [{ name: 'DHL' }],
            { countryCode: 'ES', zone: 'NACIONAL' }
        );

        expect(result).toEqual(['ERROR']);
    });
});
