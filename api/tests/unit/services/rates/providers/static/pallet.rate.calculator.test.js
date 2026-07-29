
import { calculatePallet } from '../../../../../../src/api/services/rates/providers/static/pallet.rate.calculator.js';

import {
    calculatePalletBasedPricing,
    calculateWeightVolume
} from '../../../../../../src/api/services/rates/providers/static/pallet.rate.utils.js';

import {
    buildStaticErrorResult,
    buildRateComplete
} from '../../../../../../src/api/services/rates/domains/build.rate.result.js';

import {
    PRICING_MODES
} from '../../../../../../src/lib/constants/index.js';

/**
 * `calculatePallet` ya no llama a `presentRate`: ahora siempre devuelve el
 * resultado crudo de dominio. La presentación se aplica una única vez, en
 * `static.rate.provider.js` (ver `presentAgencyRate`). Por eso este test ya
 * no mockea `presenters/rate.presenter.js`.
 */

vi.mock(
    '../../../../../../src/api/services/rates/providers/static/pallet.rate.utils.js',
    () => ({
        calculatePalletBasedPricing: vi.fn(),
        calculateWeightVolume: vi.fn()
    })
);

vi.mock(
    '../../../../../../src/api/services/rates/domains/build.rate.result.js',
    () => ({
        buildStaticErrorResult: vi.fn(),
        buildRateComplete: vi.fn()
    })
);

describe('calculatePallet', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const baseParams = {
        nameAgency: 'DHL',
        zone: {
            name: 'Madrid',
            pricingMode: {
                type: PRICING_MODES.PALLET_CLASSIFICATION
            }
        }
    };

    it('should call calculatePalletBasedPricing when pricing mode is PALLET_CLASSIFICATION', () => {

        calculateSinglePallet.mockReturnValue(['service']);

        buildRateComplete.mockReturnValue({ agency: 'DHL' });

        calculatePallet(baseParams);

        expect(calculatePalletBasedPricing).toHaveBeenCalledWith(baseParams);
        expect(calculateWeightVolume).not.toHaveBeenCalled();
    });

    it('should call calculateWeightVolume when pricing mode is WEIGHT_VOLUME', () => {

        calculateWeightVolume.mockReturnValue(['service']);

        buildRateComplete.mockReturnValue({ agency: 'DHL' });

        calculatePallet({
            ...baseParams,
            zone: {
                ...baseParams.zone,
                pricingMode: {
                    type: PRICING_MODES.WEIGHT_VOLUME
                }
            }
        });

        expect(calculateWeightVolume).toHaveBeenCalled();
        expect(calculatePalletBasedPricing).not.toHaveBeenCalled();
    });

    it('should return static NO_RATE result when the calculator returns no services', () => {

        calculatePalletBasedPricing.mockReturnValue([]);

        const expected = { error: 'NO_RATE' };

        buildStaticErrorResult.mockReturnValue(expected);

        const result = calculatePallet(baseParams);

        expect(buildStaticErrorResult)
            .toHaveBeenCalledWith({
                agency: 'DHL',
                zone: 'Madrid',
                code: 'NO_RATE'
            });

        expect(result).toBe(expected);
    });

    it('should build complete result with the raw services returned by the calculator', () => {

        calculateSinglePallet.mockReturnValue([
            { service: 'EXPRESS' }
        ]);

        const expected = {
            agency: 'DHL',
            zone: 'Madrid'
        };

        buildRateComplete.mockReturnValue(expected);

        const result = calculatePallet(baseParams);

        expect(buildRateComplete)
            .toHaveBeenCalledWith({
                agency: 'DHL',
                zone: 'Madrid',
                services: [
                    { service: 'EXPRESS' }
                ]
            });

        expect(result).toBe(expected);
    });

    it('should throw error when pricing mode is not supported', () => {

        expect(() =>
            calculatePallet({
                ...baseParams,
                zone: {
                    ...baseParams.zone,
                    pricingMode: {
                        type: 'INVALID'
                    }
                }
            })
        ).toThrow(
            'Unsupported calculation pricing mode INVALID'
        );
    });
});
