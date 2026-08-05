
import {
    getEffectiveWeight,
    classifyPallet,
    groupPallets
} from '../../../../../../src/api/services/rates/domains/pallet/pallet.rules.js';

describe('getEffectiveWeight', () => {
    beforeEach(() => {
        process.env.DEFAULT_PALLET_VOLUME = '1000000';
    });

    it('should return real weight when greater than volumetric', () => {
        const result = getEffectiveWeight({
            weight: 50,
            large: 100,
            width: 100,
            height: 100
        });

        expect(result).toBe(50);
    });

    it('should return volumetric weight when greater', () => {
        const result = getEffectiveWeight(
            {
                weight: 50,
                large: 200,
                width: 200,
                height: 200
            },
            {
                enabled: true,
                factor: 250
            }
        );

        expect(result).toBe(2000);
    });

    it('should ignore factor when disabled', () => {
        const result = getEffectiveWeight(
            {
                weight: 10,
                large: 100,
                width: 100,
                height: 100
            },
            {
                enabled: false,
                factor: 250
            }
        );

        expect(result).toBe(10);
    });
});

describe('classifyPallet', () => {
    const palletTypes = [
        {
            _id: '6a3a3a26a08c093d140210e7',
            name: 'MINI QUARTER PALLET',
            constraints: { maxWeight: 150, maxHeight: 80, maxLength: 120, maxWidth: 1000 },
        },
        {
            _id: '6a3a3a26a08c093d140210e8',
            name: 'MINI QUARTER PALLET',
            constraints: { maxWeight: 150, maxHeight: 120, maxLength: 60, maxWidth: 80 },
        },
        {
            _id: '6a3a3a26a08c093d140210e6',
            name: 'QUARTER PALLET',
            constraints: { maxWeight: 300, maxHeight: 110, maxLength: 120, maxWidth: 120 },
        },
        {
            _id: '6a3a3a26a08c093d140210e5',
            name: 'SUPER EURO LIGHT PALLET',
            constraints: { maxWeight: 300, maxHeight: 220, maxLength: 120, maxWidth: 80 },
        },
        {
            _id: '6a3a3a26a08c093d140210e4',
            name: 'EXTRA LIGHT PALLET',
            constraints: { maxWeight: 450, maxHeight: 220, maxLength: 120, maxWidth: 100 },
        },
        {
            _id: '6a3a3a26a08c093d140210e3',
            name: 'HALF PALLET',
            constraints: { maxWeight: 600, maxHeight: 160, maxLength: 120, maxWidth: 100 },
        },
        {
            _id: '6a3a3a26a08c093d140210e2',
            name: 'EURO PALLET',
            constraints: { maxWeight: 900, maxHeight: 220, maxLength: 120, maxWidth: 80 },
        },
        {
            _id: '6a3a3a26a08c093d140210e1',
            name: 'FULL PALLET',
            constraints: { maxWeight: 1200, maxHeight: 220, maxLength: 120, maxWidth: 100 },
        }
    ];

    it('should return matching pallet type', () => {
        const result = classifyPallet(
            {
                "weight": 256,
                "large": 120,
                "width": 100,
                "height": 100
            },
            palletTypes
        );

        expect(result._id).toBe('6a3a3a26a08c093d140210e6');
    });

    it('should return null when no pallet matches', () => {
        const result = classifyPallet(
            {
                weight: 1000,
                large: 500,
                width: 500,
                height: 500
            },
            palletTypes
        );

        expect(result).toBeNull();
    });
});

describe('groupPallets', () => {
    it('should create one group per pallet type id', () => {
        const palletTypes = [
            {
                _id: 'small',
                constraints: {
                    maxWeight: 100
                }
            },
            {
                _id: 'large',
                constraints: {
                    maxWeight: 500
                }
            }
        ];

        const result = groupPallets(
            [
                {
                    weight: 50,
                    large: 50,
                    width: 50,
                    height: 50
                },
                {
                    weight: 300,
                    large: 50,
                    width: 50,
                    height: 50
                }
            ],
            palletTypes
        );

        expect(result.groups).toHaveLength(2);

        expect(
            result.groups.map(g => g.palletType._id)
        ).toEqual(['small', 'large']);
    });

    it('should collect rejected items', () => {
        const palletTypes = [
            {
                _id: 'small',
                constraints: {
                    maxWeight: 100
                }
            }
        ];

        const result = groupPallets(
            [
                {
                    weight: 999,
                    large: 999,
                    width: 999,
                    height: 999
                }
            ],
            palletTypes
        );

        expect(result.groups).toHaveLength(0);
        expect(result.rejected).toHaveLength(1);
    });
});
