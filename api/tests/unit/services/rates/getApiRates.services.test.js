
import {
    getApiRates
} from '../../../../src/api/services/rates/index.js';

import { 
    carrierFactory 
} from '../../../../src/api/services/rates/providers/api/carriers/carriers.service.js';

import { getScope, SCOPE_LABELS } from '../../../../src/lib/constants/scopes.zone.js';

import { 
    buildStaticErrorResult,
    buildApiErrorResult,
    buildRateComplete 
} from '../../../../src/api/services/rates/domains/build.rate.result.js';

import { presentRate } from '../../../../src/api/services/rates/presenters/rate.presenter.js';

vi.mock('../../../../src/api/services/rates/providers/api/carriers/carriers.service.js', () => ({
    carrierFactory: vi.fn()
}));

vi.mock('../../../../src/api/services/rates/domains/build.rate.result.js', () => ({
    buildStaticErrorResult: vi.fn(),
    buildApiErrorResult: vi.fn(),
    buildRateComplete: vi.fn()
}));

vi.mock('../../../../src/api/services/rates/presenters/rate.presenter.js', () => ({
    presentRate: vi.fn()
}));

it('should return complete api rate', async () => {
    const completedRate = {
        agency: 'DHL',
        zone: 'Nacional',
        services: [
            {
                service: 'express',
                price: 12.5
            }
        ]
    };

    const agencies = [
        { name: 'DHL' }
    ];

    const input = { countryCode: 'ES' };

    const carrier = {
        getRates: vi.fn().mockResolvedValue([1, 2])
    };

    carrierFactory.mockReturnValue(carrier);

    presentRate.mockReturnValue(['RATE']);

    buildRateComplete.mockReturnValue(completedRate);

    const result = await getApiRates(agencies, input);

    expect(carrier.getRates).toHaveBeenCalledWith(input);

    expect(buildRateComplete).toHaveBeenCalledWith(
        expect.objectContaining({
            agency: 'DHL',
            zone: 'NACIONAL'
        })
    );

    expect(result).toEqual([completedRate]);
});

it('should return api error when carrier is missing', async () => {

    carrierFactory.mockReturnValue(null);

    buildApiErrorResult.mockReturnValue('ERROR');

    const result = await getApiRates(
        [{ name: 'DHL' }],
        { countryCode: 'ES' }
    );

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
        { countryCode: 'ES' }
    );

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
        { countryCode: 'ES' }
    );

  expect(result).toEqual(['ERROR']);
});