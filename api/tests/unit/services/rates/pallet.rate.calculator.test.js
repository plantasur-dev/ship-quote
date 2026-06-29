
import { calculatePallet } from '../../../../src/api/services/rates/providers/static/pallet.rate.calculator.js';

import {
    calculateSinglePallet,
    calculateWeightVolume
} from '../../../../src/api/services/rates/providers/static/pallet.rate.utils.js';

import {
    buildStaticErrorResult,
    buildRateComplete
} from '../../../../src/api/services/rates/domains/build.rate.result.js';

import { presentRate } from '../../../../src/api/services/rates/presenters/rate.presenter.js';

import {
    PRICING_MODES
} from '../../../../src/lib/constants/index.js';

vi.mock(
    '../../../../src/api/services/rates/providers/static/pallet.rate.utils.js',
    () => ({
        calculateSinglePallet: vi.fn(),
        calculateWeightVolume: vi.fn()
    })
);

vi.mock(
    '../../../../src/api/services/rates/presenters/rate.presenter.js',
    () => ({
        presentRate: vi.fn()
    })
);

vi.mock(
    '../../../../src/api/services/rates/domains/build.rate.result.js',
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
                type: PRICING_MODES.WEIGHT
            }
        }
    };

    it('should call calculateSinglePallet when pricing mode is WEIGHT', () => {

        calculateSinglePallet.mockReturnValue(['service']);
        presentRate.mockReturnValue(['service']);

        buildRateComplete.mockReturnValue({
            agency: 'DHL'
        });

        calculatePallet(baseParams);

        expect(calculateSinglePallet).toHaveBeenCalledWith(baseParams);
        expect(calculateWeightVolume).not.toHaveBeenCalled();
    });

    it('should call calculateWeightVolume when pricing mode is WEIGHT_VOLUME', () => {

        calculateWeightVolume.mockReturnValue(['service']);
        presentRate.mockReturnValue(['service']);

        buildRateComplete.mockReturnValue({
            agency: 'DHL'
        });

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
        expect(calculateSinglePallet).not.toHaveBeenCalled();
    });

    it('should call presentRate with calculated services', () => {

        calculateSinglePallet.mockReturnValue([
            { service: 'EXPRESS' }
        ]);

        presentRate.mockReturnValue([
            { service: 'EXPRESS' }
        ]);

        buildRateComplete.mockReturnValue({});

        calculatePallet(baseParams);

        expect(presentRate)
            .toHaveBeenCalledWith([
                { service: 'EXPRESS' }
            ]);
    });

    it('should return static NO_RATE result when presenter returns no services', () => {

        calculateSinglePallet.mockReturnValue([]);

        presentRate.mockReturnValue([]);

        const expected = {
            error: 'NO_RATE'
        };

        buildStaticErrorResult.mockReturnValue(expected);

        const result = calculatePallet(baseParams);

        expect(buildStaticErrorResult)
            .toHaveBeenCalledWith({
                presentRate,
                agency: 'DHL',
                code: 'NO_RATE'
            });

        expect(result).toBe(expected);

    });

    it('should build complete result', () => {

        calculateSinglePallet.mockReturnValue([
            {
                service: 'EXPRESS'
            }
        ]);

        presentRate.mockReturnValue([
            {
                service: 'EXPRESS'
            }
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
                    {
                        service: 'EXPRESS'
                    }
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