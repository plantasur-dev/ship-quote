
import {
    calculatePallet,
    buildRejectedServices
} from '../../../../src/api/services/rates/providers/static/pallet.rate.calculator.js';

import {
    getEffectiveWeight,
    matchPrice,
    groupPallets,
    calculateFuelSurcharge,
    round
} from '../../../../src/lib/utils/rate.utils.js';

import {
    buildStaticErrorResult,
    buildRateResult,
    buildRateComplete,
    buildConcept,
    buildIncident
} from '../../../../src/api/services/rates/domains/build.rate.result.js';

import { presentRate } from '../../../../src/api/services/rates/presenters/rate.presenter.js';

vi.mock(
    '../../../../src/lib/utils/rate.utils.js',
    () => ({
        getEffectiveWeight: vi.fn(),
        matchPrice: vi.fn(),
        groupPallets: vi.fn(),
        calculateFuelSurcharge: vi.fn(),
        round: vi.fn((val) => Math.round(val))
    })
);

vi.mock(
    '../../../../src/api/services/rates/domains/build.rate.result.js',
    () => ({
        buildStaticErrorResult: vi.fn(),
        buildRateResult: vi.fn(),
        buildRateComplete: vi.fn(),
        buildConcept: vi.fn(),
        buildIncident: vi.fn()
    })
);

vi.mock(
    '../../../../src/api/services/rates/presenters/rate.presenter.js',
    () => ({
        presentRate: vi.fn()
    })
);

describe('buildRejectedServices', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return empty array when no rejected items', () => {
        const result = buildRejectedServices([]);
        expect(result).toEqual([]);
    });

    it('should build rejected services for items', () => {
        const rejectedItems = [
            { pallet: 'type1', reason: 'OVERSIZED' },
            { pallet: 'type2', reason: 'WEIGHT_EXCEEDED' }
        ];

        buildIncident.mockReturnValue({ code: 'PALLET_DIMENSION_REJECTED' });
        buildRateResult.mockReturnValue({
            service: 'REJECTED_PALLET',
            transportType: 'pallet',
            incidents: [{ code: 'PALLET_DIMENSION_REJECTED' }]
        });

        const result = buildRejectedServices(rejectedItems);

        expect(buildIncident).toHaveBeenCalledTimes(2);
        expect(buildRateResult).toHaveBeenCalled();
    });

    it('should include all rejected items in incidents', () => {
        const rejectedItems = [
            { id: 1, reason: 'OVERSIZED' },
            { id: 2, reason: 'WEIGHT_EXCEEDED' },
            { id: 3, reason: 'INVALID_DIMENSION' }
        ];

        buildIncident.mockReturnValue({ code: 'PALLET_DIMENSION_REJECTED' });
        buildRateResult.mockReturnValue({
            service: 'REJECTED_PALLET',
            incidents: []
        });

        buildRejectedServices(rejectedItems);

        expect(buildIncident).toHaveBeenCalledTimes(3);
        expect(buildRateResult).toHaveBeenCalledWith(
            expect.objectContaining({
                service: 'REJECTED_PALLET',
                transportType: 'pallet'
            })
        );
    });
});

describe('calculatePallet', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('pricing mode weight_volume', () => {
        it('should calculate weight volume pricing correctly', () => {
            const palletItems = [
                { weight: 500, volume: 2 },
                { weight: 300, volume: 1.5 }
            ];

            getEffectiveWeight.mockReturnValue(500).mockReturnValueOnce(500).mockReturnValueOnce(300);
            
            const agencyRates = new Map([
                ['pallet|Madrid|none', {
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ minWeight: 0, price: 10 }]
                        }
                    ]
                }]
            ]);

            matchPrice.mockReturnValue({ price: 10 });
            calculateFuelSurcharge.mockReturnValue(2);
            round.mockReturnValue(12);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 12 });
            buildRateResult.mockReturnValue({
                service: 'express',
                transportType: 'pallet',
                totalWeight: 800
            });
            presentRate.mockReturnValue([
                { service: 'express', price: 12 }
            ]);
            buildRateComplete.mockReturnValue({
                agency: 'DHL',
                zone: 'Madrid',
                services: [{ service: 'express', price: 12 }]
            });

            const result = calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight_volume' },
                    volumetric: 5
                },
                agencySupplements: {},
                agencyPalletTypes: [],
                nameAgency: 'DHL'
            });

            expect(getEffectiveWeight).toHaveBeenCalled();
            expect(matchPrice).toHaveBeenCalled();
            expect(buildRateComplete).toHaveBeenCalledWith({
                agency: 'DHL',
                zone: 'Madrid',
                services: expect.any(Array)
            });
        });

        it('should return empty array when no rate found for weight_volume', () => {
            const palletItems = [{ weight: 500, volume: 2 }];
            const agencyRates = new Map();

            getEffectiveWeight.mockReturnValue(500);
            presentRate.mockReturnValue([]);
            buildStaticErrorResult.mockReturnValue({
                error: 'NO_RATE',
                agency: 'DHL'
            });

            const result = calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight_volume' }
                },
                agencySupplements: {},
                agencyPalletTypes: [],
                nameAgency: 'DHL'
            });

            expect(buildStaticErrorResult).toHaveBeenCalledWith({
                presentRate: expect.any(Function),
                agency: 'DHL',
                code: 'NO_RATE'
            });
        });

        it('should skip services when no price match for total weight', () => {
            const palletItems = [{ weight: 100, volume: 0.5 }];
            const agencyRates = new Map([
                ['pallet|Madrid|none', {
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ minWeight: 1000, price: 20 }]
                        }
                    ]
                }]
            ]);

            getEffectiveWeight.mockReturnValue(100);
            matchPrice.mockReturnValue(null);
            presentRate.mockReturnValue([]);
            buildStaticErrorResult.mockReturnValue({ error: 'NO_RATE' });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight_volume' }
                },
                agencySupplements: {},
                agencyPalletTypes: [],
                nameAgency: 'MRW'
            });

            expect(matchPrice).toHaveBeenCalled();
            expect(buildStaticErrorResult).toHaveBeenCalled();
        });
    });

    describe('pricing mode by pallet quantity', () => {
        it('should calculate single pallet pricing correctly', () => {

            const palletItems = [
                { type: 'EUR', weight: 500 },
                { type: 'EUR', weight: 300 }
            ];

            const palletType = { _id: '123', name: 'EUR' };
            const groups = [{ palletType, quantity: 2, items: palletItems }];
            const rejected = [];

            groupPallets.mockReturnValue({ groups, rejected });

            const agencyRates = new Map([
                ['pallet|Madrid|EUR', {
                    calculationType: 'quantity',
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ minQuantity: 0, price: 50 }]
                        }
                    ]
                }]
            ]);

            matchPrice.mockReturnValue({ price: 50 });
            calculateFuelSurcharge.mockReturnValue(5);
            round.mockReturnValue(110);
            buildConcept.mockReturnValue({
                name: 'BASE',
                amount: 110,
                metadata: { quantity: 2, palletType: 'EUR' }
            });
            buildRateResult.mockReturnValue({
                service: 'express',
                transportType: 'pallet',
                itemCount: 2
            });
            presentRate.mockReturnValue([
                { service: 'express', price: 110 }
            ]);
            buildRateComplete.mockReturnValue({
                agency: 'FEDEX',
                zone: 'Madrid',
                services: [{ service: 'express', price: 110 }]
            });

            const result = calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight' }
                },
                agencySupplements: {},
                agencyPalletTypes: [palletType],
                nameAgency: 'FEDEX'
            });

            expect(groupPallets).toHaveBeenCalled();
            expect(buildRateComplete).toHaveBeenCalledWith({
                agency: 'FEDEX',
                zone: 'Madrid',
                services: expect.any(Array)
            });
        });

        it('should handle rejected pallets in single pallet pricing', () => {
            const palletItems = [
                { type: 'EUR', weight: 500 },
                { type: 'INVALID', weight: 2000 }
            ];

            const palletType = { _id: '123', name: 'EUR' };
            const groups = [{ palletType, quantity: 1, items: [palletItems[0]] }];
            const rejected = [{ pallet: 'INVALID', reason: 'WEIGHT_EXCEEDED' }];

            groupPallets.mockReturnValue({ groups, rejected });

            const agencyRates = new Map([
                ['pallet|Madrid|EUR', {
                    calculationType: 'quantity',
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ minQuantity: 0, price: 50 }]
                        }
                    ]
                }]
            ]);

            matchPrice.mockReturnValue({ price: 50 });
            calculateFuelSurcharge.mockReturnValue(5);
            round.mockReturnValue(55);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 55 });
            buildRateResult.mockReturnValue({
                service: 'express',
                transportType: 'pallet'
            });
            buildIncident.mockReturnValue({ code: 'PALLET_DIMENSION_REJECTED' });
            presentRate.mockReturnValue([
                { service: 'express', price: 55 }
            ]);
            buildRateComplete.mockReturnValue({
                agency: 'DHL',
                zone: 'Madrid',
                services: [{ service: 'express', price: 55 }]
            });

            const result = calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight' }
                },
                agencySupplements: {},
                agencyPalletTypes: [palletType],
                nameAgency: 'DHL'
            });

            expect(buildIncident).toHaveBeenCalled();
        });

        it('should return NO_RATE error when no services available', () => {
            const palletItems = [{ type: 'EUR', weight: 500 }];
            const palletType = { _id: '123', name: 'EUR' };
            const groups = [];
            const rejected = [];

            groupPallets.mockReturnValue({ groups, rejected });
            presentRate.mockReturnValue([]);
            buildStaticErrorResult.mockReturnValue({
                error: 'NO_RATE',
                agency: 'MRW'
            });

            const result = calculatePallet({
                palletItems,
                agencyRates: new Map(),
                zone: {
                    calculationMode: 'pallet',
                    name: 'Barcelona',
                    pricingMode: { type: 'weight' }
                },
                agencySupplements: {},
                agencyPalletTypes: [palletType],
                nameAgency: 'MRW'
            });

            expect(buildStaticErrorResult).toHaveBeenCalledWith({
                presentRate: expect.any(Function),
                agency: 'MRW',
                code: 'NO_RATE'
            });
        });

        it('should skip groups when no rate found for pallet type', () => {
            const palletItems = [{ type: 'EUR', weight: 500 }];
            const palletType = { _id: '123', name: 'EUR' };
            const groups = [{ palletType, quantity: 1, items: palletItems }];
            const rejected = [];

            groupPallets.mockReturnValue({ groups, rejected });

            const agencyRates = new Map();
            presentRate.mockReturnValue([]);
            buildStaticErrorResult.mockReturnValue({ error: 'NO_RATE' });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Valencia',
                    pricingMode: { type: 'weight' }
                },
                agencySupplements: {},
                agencyPalletTypes: [palletType],
                nameAgency: 'TECUM'
            });

            expect(buildStaticErrorResult).toHaveBeenCalled();
        });

        it('should skip services when no price match for quantity', () => {
            const palletItems = [{ type: 'EUR', weight: 500 }];
            const palletType = { _id: '123', name: 'EUR' };
            const groups = [{ palletType, quantity: 1, items: palletItems }];
            const rejected = [];

            groupPallets.mockReturnValue({ groups, rejected });

            const agencyRates = new Map([
                ['pallet|Madrid|123', {
                    calculationType: 'quantity',
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ minQuantity: 10, price: 50 }]
                        }
                    ]
                }]
            ]);

            matchPrice.mockReturnValue(null);
            presentRate.mockReturnValue([]);
            buildStaticErrorResult.mockReturnValue({ error: 'NO_RATE' });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight' }
                },
                agencySupplements: {},
                agencyPalletTypes: [palletType],
                nameAgency: 'DHL'
            });
            
            expect(matchPrice).toHaveBeenCalled();
            expect(buildStaticErrorResult).toHaveBeenCalled();
        });
    });

    describe('fuel surcharge application', () => {
        it('should apply fuel surcharge to weight_volume pricing', () => {
            const palletItems = [{
                typeServices: 'pallet',
                weight: 1000,
                large: 90,
                width: 80,
                height: 60
            }];

            const agencyRates = new Map([
                ['pallet|Madrid|none', {
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ minWeight: 0, price: 100 }]
                        }
                    ]
                }]
            ]);

            const fuelSurcharge = {
                enabled: true,
                type: 'percentage',
                value: 15
            }

            getEffectiveWeight.mockReturnValue(1000);
            matchPrice.mockReturnValue({ price: 100 });
            calculateFuelSurcharge.mockReturnValue(20);
            round.mockReturnValue(120);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 120 });
            buildRateResult.mockReturnValue({
                service: 'express',
                transportType: 'pallet'
            });
            presentRate.mockReturnValue([{ service: 'express', price: 120 }]);
            buildRateComplete.mockReturnValue({
                agency: 'DHL',
                zone: 'Madrid',
                services: [{ service: 'express', price: 120 }]
            });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight_volume' }
                },
                agencySupplements: {
                    fuelSurcharge
                },
                agencyPalletTypes: [],
                nameAgency: 'DHL'
            });

            expect(getEffectiveWeight).toHaveBeenCalled();
            expect(calculateFuelSurcharge).toHaveBeenCalledWith({
                    fuelSurcharge
                },
                100
            );
        });

        it('should apply fuel surcharge to quantity pricing', () => {
            const palletItems = [{ type: 'EUR', weight: 500 }];
            const palletType = { _id: '123', name: 'EUR' };
            const groups = [{ palletType, quantity: 5, items: palletItems }];
            const rejected = [];

            groupPallets.mockReturnValue({ groups, rejected });

            const agencyRates = new Map([
                ['pallet|Madrid|123', {
                    calculationType: 'quantity',
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ min: 0, price: 100 }]
                        }
                    ]
                }]
            ]);

            matchPrice.mockReturnValue({ price: 100 });
            calculateFuelSurcharge.mockReturnValue(10);
            round.mockReturnValue(550);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 550 });
            buildRateResult.mockReturnValue({
                service: 'express',
                transportType: 'pallet'
            });
            presentRate.mockReturnValue([{ service: 'express', price: 550 }]);
            buildRateComplete.mockReturnValue({
                agency: 'MRW',
                zone: 'Madrid',
                services: [{ service: 'express', price: 550 }]
            });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight' }
                },
                agencySupplements: {
                    fuelSurcharge: {
                        enabled: true,
                        type: 'percentage',
                        value: 1
                    }
                },
                agencyPalletTypes: [palletType],
                nameAgency: 'MRW'
            });

            expect(calculateFuelSurcharge).toHaveBeenCalled();
        });
    });

    describe('multiple services per rate', () => {
        it('should process multiple services for weight_volume pricing', () => {
            const palletItems = [{ weight: 500, volume: 2 }];
            const agencyRates = new Map([
                ['pallet|Madrid|none', {
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ minWeight: 0, price: 50 }]
                        },
                        {
                            service: 'standard',
                            priceBreaks: [{ minWeight: 0, price: 30 }]
                        },
                        {
                            service: 'economy',
                            priceBreaks: [{ minWeight: 0, price: 15 }]
                        }
                    ]
                }]
            ]);

            getEffectiveWeight.mockReturnValue(500);
            matchPrice.mockReturnValue({ price: 50 });
            calculateFuelSurcharge.mockReturnValue(5);
            round.mockReturnValue(55);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 55 });
            buildRateResult
                .mockReturnValueOnce({ service: 'express' })
                .mockReturnValueOnce({ service: 'standard' })
                .mockReturnValueOnce({ service: 'economy' });
            presentRate.mockReturnValue([
                { service: 'express', price: 55 },
                { service: 'standard', price: 33 },
                { service: 'economy', price: 16 }
            ]);
            buildRateComplete.mockReturnValue({
                agency: 'DHL',
                zone: 'Madrid',
                services: [
                    { service: 'express', price: 55 },
                    { service: 'standard', price: 33 },
                    { service: 'economy', price: 16 }
                ]
            });

            const result = calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight_volume' }
                },
                agencySupplements: {},
                agencyPalletTypes: [],
                nameAgency: 'DHL'
            });

            expect(buildRateResult).toHaveBeenCalledTimes(3);
        });

        it('should process multiple services for quantity pricing', () => {
            const palletItems = [{ type: 'EUR', weight: 500 }];
            const palletType = { _id: '123', name: 'EUR' };
            const groups = [{ palletType, quantity: 3, items: palletItems }];
            const rejected = [];

            groupPallets.mockReturnValue({ groups, rejected });

            const agencyRates = new Map([
                ['pallet|Madrid|123', {
                    calculationType: 'quantity',
                    services: [
                        {
                            service: 'express',
                            priceBreaks: [{ minQuantity: 0, price: 75 }]
                        },
                        {
                            service: 'standard',
                            priceBreaks: [{ minQuantity: 0, price: 50 }]
                        }
                    ]
                }]
            ]);

            matchPrice.mockReturnValue({ price: 75 });
            calculateFuelSurcharge.mockReturnValue(7.5);
            round.mockReturnValue(247.5);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 247.5 });
            buildRateResult
                .mockReturnValueOnce({ service: 'express' })
                .mockReturnValueOnce({ service: 'standard' });
            presentRate.mockReturnValue([
                { service: 'express', price: 247.5 },
                { service: 'standard', price: 165 }
            ]);
            buildRateComplete.mockReturnValue({
                agency: 'FEDEX',
                zone: 'Madrid',
                services: [
                    { service: 'express', price: 247.5 },
                    { service: 'standard', price: 165 }
                ]
            });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight' }
                },
                agencySupplements: {},
                agencyPalletTypes: [palletType],
                nameAgency: 'FEDEX'
            });

            expect(buildRateResult).toHaveBeenCalledTimes(2);
        });
    });

    describe('result structure', () => {
        it('should include agency name in result', () => {
            const palletItems = [{ weight: 500, volume: 2 }];
            const agencyRates = new Map([
                ['pallet|Madrid|none', {
                    services: [
                        { service: 'express', priceBreaks: [{ minWeight: 0, price: 50 }] }
                    ]
                }]
            ]);

            getEffectiveWeight.mockReturnValue(500);
            matchPrice.mockReturnValue({ price: 50 });
            calculateFuelSurcharge.mockReturnValue(5);
            round.mockReturnValue(55);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 55 });
            buildRateResult.mockReturnValue({ service: 'express' });
            presentRate.mockReturnValue([{ service: 'express', price: 55 }]);
            buildRateComplete.mockReturnValue({
                agency: 'CAYCO',
                zone: 'Madrid',
                services: [{ service: 'express', price: 55 }]
            });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight_volume' }
                },
                agencySupplements: {},
                agencyPalletTypes: [],
                nameAgency: 'CAYCO'
            });

            expect(buildRateComplete).toHaveBeenCalledWith(
                expect.objectContaining({ agency: 'CAYCO' })
            );
        });

        it('should include zone name in result', () => {
            const palletItems = [{ type: 'EUR', weight: 500 }];
            const palletType = { _id: '123', name: 'EUR' };
            const groups = [{ palletType, quantity: 1, items: palletItems }];
            const rejected = [];

            groupPallets.mockReturnValue({ groups, rejected });

            const agencyRates = new Map([
                ['pallet|Barcelona|EUR', {
                    calculationType: 'quantity',
                    services: [
                        { service: 'express', priceBreaks: [{ minQuantity: 0, price: 60 }] }
                    ]
                }]
            ]);

            matchPrice.mockReturnValue({ price: 60 });
            calculateFuelSurcharge.mockReturnValue(6);
            round.mockReturnValue(66);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 66 });
            buildRateResult.mockReturnValue({ service: 'express' });
            presentRate.mockReturnValue([{ service: 'express', price: 66 }]);
            buildRateComplete.mockReturnValue({
                agency: 'DHL',
                zone: 'Barcelona',
                services: [{ service: 'express', price: 66 }]
            });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Barcelona',
                    pricingMode: { type: 'weight' }
                },
                agencySupplements: {},
                agencyPalletTypes: [palletType],
                nameAgency: 'DHL'
            });

            expect(buildRateComplete).toHaveBeenCalledWith(
                expect.objectContaining({ zone: 'Barcelona' })
            );
        });

        it('should include services array in result', () => {
            const palletItems = [{ weight: 500, volume: 2 }];
            const agencyRates = new Map([
                ['pallet|Madrid|none', {
                    services: [
                        { service: 'express', priceBreaks: [{ minWeight: 0, price: 50 }] }
                    ]
                }]
            ]);

            getEffectiveWeight.mockReturnValue(500);
            matchPrice.mockReturnValue({ price: 50 });
            calculateFuelSurcharge.mockReturnValue(5);
            round.mockReturnValue(55);
            buildConcept.mockReturnValue({ name: 'BASE', amount: 55 });
            buildRateResult.mockReturnValue({ service: 'express', price: 55 });
            presentRate.mockReturnValue([{ service: 'express', price: 55 }]);
            buildRateComplete.mockReturnValue({
                agency: 'MRW',
                zone: 'Madrid',
                services: [{ service: 'express', price: 55 }]
            });

            calculatePallet({
                palletItems,
                agencyRates,
                zone: {
                    calculationMode: 'pallet',
                    name: 'Madrid',
                    pricingMode: { type: 'weight_volume' }
                },
                agencySupplements: {},
                agencyPalletTypes: [],
                nameAgency: 'MRW'
            });

            expect(buildRateComplete).toHaveBeenCalledWith(
                expect.objectContaining({
                    services: expect.arrayContaining([
                        expect.objectContaining({ service: 'express' })
                    ])
                })
            );
        });
    });
});