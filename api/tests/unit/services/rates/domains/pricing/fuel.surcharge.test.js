
import { applyFuelSurcharge } from '../../../../../../src/api/services/rates/domains/pricing/fuel.surcharge.js';

describe('applyFuelSurcharge', () => {
    it('should return 0 when disabled', () => {
        expect(
            applyFuelSurcharge(
                100,
                { fuelSurcharge: { enabled: false } }
            )
        ).toBe(0);
    });

    it('should return 0 when there are no agencySupplements', () => {
        expect(
            applyFuelSurcharge(100, undefined)
        ).toBe(0);
    });

    it('should calculate percentage surcharge', () => {
        expect(
            applyFuelSurcharge(
                100,
                {
                    fuelSurcharge: {
                        enabled: true,
                        type: 'percentage',
                        value: 10
                    }
                }
            )
        ).toBe(10);
    });

    it('should calculate fixed surcharge', () => {
        expect(
            applyFuelSurcharge(
                100,
                {
                    fuelSurcharge: {
                        enabled: true,
                        type: 'fixed',
                        value: 15
                    }
                }
            )
        ).toBe(15);
    });

    it('should return 0 for an unknown surcharge type', () => {
        expect(
            applyFuelSurcharge(
                100,
                {
                    fuelSurcharge: {
                        enabled: true,
                        type: 'unknown',
                        value: 15
                    }
                }
            )
        ).toBe(0);
    });
});
