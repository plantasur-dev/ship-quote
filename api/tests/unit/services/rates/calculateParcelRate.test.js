
import {
    calculateParcelRate
} from '../../../../src/api/services/rates/providers/static/parcel.rate.calculator.js';

import {
    validateParcelItem,
    enrichParcelItem,
    calculateParcelTotals
} from '../../../../src/api/services/rates/providers/static/parcel.rate.utils.js';

import {
    buildParcelRate,
    buildIncident
} from '../../../../src/api/services/rates/domains/build.rate.result.js';

vi.mock(
    '../../../../src/api/services/rates/providers/static/parcel.rate.utils.js',
    () => ({
        validateParcelItem: vi.fn(),
        enrichParcelItem: vi.fn(),
        calculateParcelTotals: vi.fn(),
        resolveParcelPrice: vi.fn()
    })
);

vi.mock(
    '../../../../src/api/services/rates/domains/build.rate.result.js',
    () => ({
        buildParcelRate: vi.fn(),
        buildIncident: vi.fn(),
        buildRateComplete: vi.fn(),
        buildStaticErrorResult: vi.fn()
    })
);

describe('calculateParcelRate', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return CALCULATION_ERROR incident when pricing mode is invalid', () => {

        validateParcelItem.mockReturnValue(null);

        enrichParcelItem.mockReturnValue({
            weight: 10,
            large: 10,
            width: 10,
            height: 10
        });

        calculateParcelTotals.mockReturnValue({
            extraDimensionsCost: 0,
            totalItemsWeight: 10,
            volumetric: 5
        });

        buildIncident.mockReturnValue({
            code: 'CALCULATION_ERROR'
        });

        buildParcelRate.mockReturnValue({
            incidents: [
                {
                    code: 'CALCULATION_ERROR'
                }
            ]
        });

        const agencyRates = new Map([
            [
                'parcel|Madrid|none',
                {
                    services: [
                        {
                            service: 'express',
                            surcharges: {},
                            limits: {}
                        }
                    ]
                }
            ]
        ]);

        const result = calculateParcelRate({
            parcelItems: [
                {
                    weight: 10,
                    large: 10,
                    width: 10,
                    height: 10
                }
            ],
            agencyRates,
            zone: {
                calculationMode: 'parcel',
                name: 'Madrid',
                pricingMode: {
                    type: 'invalid'
                }
            },
            agencySupplements: {}
        });

        expect(buildIncident).toHaveBeenCalledWith(
            'CALCULATION_ERROR'
        );

        expect(buildParcelRate).toHaveBeenCalledWith({
            serviceName: 'express',
            itemCount: 0,
            totalWeight: 0,
            incidents: [
                {
                    code: 'CALCULATION_ERROR'
                }
            ]
        });

        expect(result).toEqual([
            {
                incidents: [
                    {
                        code: 'CALCULATION_ERROR'
                    }
                ]
            }
        ]);
    });

});