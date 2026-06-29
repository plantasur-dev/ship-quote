
import {
    calculateVolume,
    calculateVolumeM3,
    getEffectiveWeight,
    classifyPallet,
    groupPallets,
    resolveZone,
    matchPrice,
    calculateExcessWeight,
    calculateFuelSurcharge,
    calculateAdditionalWeightBlockCost,
    matchDimensions,
    round
} from '../../../src/lib/utils/rate.utils.js';

describe('calculateVolume', () => {
    it('should calculate volume', () => {
        expect(
            calculateVolume({
                large: 100,
                width: 50,
                height: 20
            })
        ).toBe(100000);
    });
});

describe('calculateVolumeM3', () => {
    beforeEach(() => {
        process.env.DEFAULT_PALLET_VOLUME = '1000000';
    });

    it('should use default pallet volume', () => {
        const result = calculateVolumeM3({
            large: 100,
            width: 100,
            height: 100
        });

        expect(result).toBe(1);
    });

    it('should use custom volume quantity', () => {
        const result = calculateVolumeM3(
            {
                large: 100,
                width: 100,
                height: 100
            },
            500000
        );

        expect(result).toBe(2);
    });
});

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
    const palletTypes = [
        {
            _id: 'small',
            constraints: {
                maxWeight: 100
            }
        }
    ];

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

describe('resolveZone', () => {
    it('should return postal code zone', () => {
        const zone = { _id: 'zone1' };

        const agencyData = {
            zoneRulesByPostal: new Map([
                ['ES-M', new Map([
                    ['28001', { zoneId: 'zone1' }]
                ])]
            ]),
            zoneRulesByProvince: new Map(),
            zonesById: new Map([
                ['zone1', zone]
            ])
        };

        expect(
            resolveZone(agencyData, '28001', 'ES-M')
        ).toEqual(zone);
    });

    it('should return default province zone', () => {
        const zone = { _id: 'zone1' };

        const agencyData = {
            zoneRulesByPostal: new Map(),
            zoneRulesByProvince: new Map([
                ['ES-M', [
                    {
                        zoneId: 'zone1',
                        isDefault: true
                    }
                ]]
            ]),
            zonesById: new Map([
                ['zone1', zone]
            ])
        };

        expect(
            resolveZone(agencyData, '28001', 'ES-M')
        ).toEqual(zone);
    });

    it('should return null when province has no zones', () => {
        const agencyData = {
            zoneRulesByPostal: new Map(),
            zoneRulesByProvince: new Map(),
            zonesById: new Map()
        };

        expect(
            resolveZone(agencyData, '28001', 'ES-M')
        ).toBeNull();
    });
});

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
});

describe('calculateFuelSurcharge', () => {
    it('should return 0 when disabled', () => {
        expect(
            calculateFuelSurcharge(
                { fuelSurcharge: { enabled: false } },
                100
            )
        ).toBe(0);
    });

    it('should calculate percentage surcharge', () => {
        expect(
            calculateFuelSurcharge(
                {
                    fuelSurcharge: {
                        enabled: true,
                        type: 'percentage',
                        value: 10
                    }
                },
                100
            )
        ).toBe(10);
    });

    it('should calculate fixed surcharge', () => {
        expect(
            calculateFuelSurcharge(
                {
                    fuelSurcharge: {
                        enabled: true,
                        type: 'fixed',
                        value: 15
                    }
                },
                100
            )
        ).toBe(15);
    });
});

describe('calculateExcessWeight', () => {
    it('should return 0 when disabled', () => {
        expect(
            calculateExcessWeight(
                { enabled: false },
                10
            )
        ).toBe(0);
    });

    it('should calculate excess cost', () => {
        expect(
            calculateExcessWeight(
                {
                    enabled: true,
                    pricePerKg: 2
                },
                10
            )
        ).toBe(20);
    });
});

describe('calculateAdditionalWeightBlockCost', () => {
    it('should return 0 when disabled', () => {
        expect(
            calculateAdditionalWeightBlockCost(
                { enabled: false },
                100
            )
        ).toBe(0);
    });

    it('should return 0 when weight does not exceed threshold', () => {
        expect(
            calculateAdditionalWeightBlockCost(
                {
                    enabled: true,
                    thresholdKg: 40,
                    divisor: 10,
                    pricePerBlock: 5
                },
                40
            )
        ).toBe(0);
    });

    it('should calculate blocks correctly', () => {
        expect(
            calculateAdditionalWeightBlockCost(
                {
                    enabled: true,
                    thresholdKg: 40,
                    divisor: 10,
                    pricePerBlock: 5
                },
                65
            )
        ).toBe(15);
    });
});

describe('matchDimensions', () => {
    const ranges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 }
    ];

    it('should return matching range', () => {
        expect(matchDimensions(ranges, 150))
            .toEqual(ranges[1]);
    });
});

describe('round', () => {
    it('should round to two decimals', () => {
        expect(round(10.126)).toBe(10.13);
    });

    it('should keep two decimal precision', () => {
        expect(round(10.121)).toBe(10.12);
    });
});