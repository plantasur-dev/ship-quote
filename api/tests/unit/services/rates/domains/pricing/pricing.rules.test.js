
import {
    matchPrice,
    calculateTonnagePricing,
    calculateExcessWeight,
    calculateAdditionalWeightBlockCost
} from '../../../../../../src/api/services/rates/domains/pricing/pricing.rules.js';

describe('matchPrice', () => {
    const breaks = [
        { min: 0, max: 10, price: 5 },
        { min: 11, max: 20, price: 10 }
    ];

    it('should return matching break', () => {
        expect(matchPrice(breaks, 15))
            .toEqual(breaks[1]);
    });

    it('should return undefined when not matched', () => {
        expect(matchPrice(breaks, 50))
            .toBeUndefined();
    });

    it('should return last break when fallback is enabled', () => {
        expect(matchPrice(breaks, 50, true))
            .toEqual(breaks[1]);
    });

    it('should return undefined when breaks is empty', () => {
        expect(matchPrice([], 10))
            .toBeUndefined();
    });

    it('should return undefined when breaks is not an array', () => {
        expect(matchPrice(undefined, 10))
            .toBeUndefined();
    });

    it('should return undefined when matched break has no price', () => {
        const breaksWithoutPrice = [
            { min: 0, max: 10 },
            { min: 11, max: 20, price: 10 }
        ];

        expect(matchPrice(breaksWithoutPrice, 5))
            .toBeUndefined();
    });
});

describe('calculateTonnagePricing', () => {
    it('should return €/kg when rule is undefined', () => {
        expect(
            calculateTonnagePricing(undefined, 12, 2500)
        ).toEqual({ price: 12, unit: '€/kg' });
    });

    it('should return €/kg when rule is disabled', () => {
        expect(
            calculateTonnagePricing(
                { enabled: false, threshold: 1000, unit: '€/tn' },
                20,
                2000
            )
        ).toEqual({ price: 20, unit: '€/kg' });
    });

    it('should return €/kg when threshold is not reached', () => {
        expect(
            calculateTonnagePricing(
                { enabled: true, threshold: 1000, unit: '€/tn' },
                15,
                800
            )
        ).toEqual({ price: 15, unit: '€/kg' });
    });

    it('should calculate tonnage price when threshold is reached', () => {
        expect(
            calculateTonnagePricing(
                { enabled: true, threshold: 1000, unit: '€/tn' },
                20,
                2500
            )
        ).toEqual({ price: 50, unit: '€/tn' });
    });
});

describe('calculateExcessWeight', () => {
    it('should return 0 when disabled', () => {
        expect(
            calculateExcessWeight({ enabled: false }, 10)
        ).toBe(0);
    });

    it('should calculate excess cost', () => {
        expect(
            calculateExcessWeight({ enabled: true, pricePerKg: 2 }, 10)
        ).toBe(20);
    });
});

describe('calculateAdditionalWeightBlockCost', () => {
    it('should return 0 when disabled', () => {
        expect(
            calculateAdditionalWeightBlockCost({ enabled: false }, 100)
        ).toBe(0);
    });

    it('should return 0 when weight does not exceed threshold', () => {
        expect(
            calculateAdditionalWeightBlockCost(
                { enabled: true, thresholdKg: 40, divisor: 10, pricePerBlock: 5 },
                40
            )
        ).toBe(0);
    });

    it('should calculate blocks correctly', () => {
        expect(
            calculateAdditionalWeightBlockCost(
                { enabled: true, thresholdKg: 40, divisor: 10, pricePerBlock: 5 },
                65
            )
        ).toBe(15);
    });
});
