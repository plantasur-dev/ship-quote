
import { calculateParcelRate } from '../../../../src/api/services/rates/providers/static/parcel.rate.calculator.js';

import {
    validateParcelItem,
    enrichParcelItem,
    calculateParcelTotals,
    resolveParcelPrice
} from '../../../../src/api/services/rates/providers/static/parcel.rate.utils.js';

vi.mock(
    '../../../../src/api/services/rates/providers/static/parcel.rate.utils.js',
    () => ({
        validateParcelItem: vi.fn(),
        enrichParcelItem: vi.fn(),
        calculateParcelTotals: vi.fn(),
        resolveParcelPrice: vi.fn()
    })
);

const baseInput = {
    parcelItems: [
        {
            weight: 10,
            large: 10,
            width: 10,
            height: 10
        }
    ],
    agencyRates: new Map([
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
    ]),
    zone: {
        calculationMode: 'parcel',
        name: 'Madrid',
        pricingMode: {
            type: 'weight'
        }
    },
    agencySupplements: {}
};

describe('calculateParcelRate (unit)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return empty array when no parcel items', () => {
        const result = calculateParcelRate({
            ...baseInput,
            parcelItems: []
        });

        expect(result).toEqual([]);
    });

    it('should return empty array when no rate found', () => {
        const result = calculateParcelRate({
            ...baseInput,
            agencyRates: new Map()
        });

        expect(result).toEqual([]);
    });

    it('should return incidents when all items are invalid', () => {

        validateParcelItem.mockReturnValue({ code: 'INVALID' });

        const result = calculateParcelRate(baseInput);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return NO_RATE incident when price is not found', () => {

        validateParcelItem.mockReturnValue(null);

        enrichParcelItem.mockReturnValue({ weight: 10 });

        calculateParcelTotals.mockReturnValue({
            extraDimensionsCost: 0,
            totalItemsWeight: 10,
            volumetric: 5
        });

        resolveParcelPrice.mockReturnValue(null);

        const result = calculateParcelRate(baseInput);

        expect(result[0].incidents[0].code).toBe('NO_RATE');
    });

    it('should return valid parcel rate', () => {

        validateParcelItem.mockReturnValue(null);

        enrichParcelItem.mockReturnValue({
            weight: 10,
            large: 10,
            width: 10,
            height: 10,
            dimensionSupplement: 0
        });

        calculateParcelTotals.mockReturnValue({
            extraDimensionsCost: 0,
            totalItemsWeight: 10,
            volumetric: 5
        });

        resolveParcelPrice.mockReturnValue({
            concepts: [
                {
                    code: 'BASE',
                    amount: 5,
                    meta: {}
                }
            ]
        });

        const result = calculateParcelRate(baseInput);

        expect(result).toHaveLength(1);

        expect(result[0]).toMatchObject({
            service: 'express',
            transportType: 'parcel',
            itemCount: 1,
            totalWeight: 10,
            concepts: [
                {
                    code: 'BASE',
                    amount: 5
                }
            ],
            incidents: [],
            total: 5
        });
    });
});