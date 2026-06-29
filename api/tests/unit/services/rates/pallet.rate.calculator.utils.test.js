
import {
    calculateTonnagePricing,
    calculatePricing,
    calculateWeightVolume,
    calculateGroupServices,
    calculateSinglePallet
} from '../../../../src/api/services/rates/providers/static/pallet.rate.utils.js';

import {
    getEffectiveWeight,
    matchPrice,
    calculateFuelSurcharge,
    round,
    groupPallets
} from '../../../../src/lib/utils/rate.utils.js';

import {
    buildRateResult,
    buildConcept,
    buildRejectedServices,
    buildIncident
} from '../../../../src/api/services/rates/domains/build.rate.result.js';

vi.mock(
    '../../../../src/lib/utils/rate.utils.js',
    () => ({
        getEffectiveWeight: vi.fn(),
        matchPrice: vi.fn(),
        calculateFuelSurcharge: vi.fn(),
        round: vi.fn(value => Math.round(value)),
        groupPallets: vi.fn()
    })
);

vi.mock(
    '../../../../src/api/services/rates/domains/build.rate.result.js',
    () => ({
        buildRateResult: vi.fn(),
        buildConcept: vi.fn(),
        buildRejectedServices: vi.fn(),
        buildIncident: vi.fn()
    })
);

describe('calculateTonnagePricing', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return €/kg when rule is undefined', () => {

        round.mockReturnValue(12);

        expect(
            calculateTonnagePricing(
                undefined,
                12,
                2500
            )
        ).toEqual({
            price: 12,
            unit: '€/kg'
        });

    });

    it('should return €/kg when rule is disabled', () => {

        round.mockReturnValue(20);

        expect(
            calculateTonnagePricing(
                {
                    enabled: false,
                    threshold: 1000,
                    unit: '€/tn'
                },
                20,
                2000
            )
        ).toEqual({
            price: 20,
            unit: '€/kg'
        });

    });

    it('should return €/kg when threshold is not reached', () => {

        round.mockReturnValue(15);

        expect(
            calculateTonnagePricing(
                {
                    enabled: true,
                    threshold: 1000,
                    unit: '€/tn'
                },
                15,
                800
            )
        ).toEqual({
            price: 15,
            unit: '€/kg'
        });

    });

    it('should calculate tonnage price when threshold is reached', () => {

        round
            .mockReturnValueOnce(20)
            .mockReturnValueOnce(50);

        expect(
            calculateTonnagePricing(
                {
                    enabled: true,
                    threshold: 1000,
                    unit: '€/tn'
                },
                20,
                2500
            )
        ).toEqual({
            price: 50,
            unit: '€/tn'
        });

    });

});

describe('calculatePricing', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply fuel surcharge before tonnage pricing', () => {

        calculateFuelSurcharge.mockReturnValue(5);

        round
            .mockReturnValueOnce(105)
            .mockReturnValueOnce(105);

        const result = calculatePricing(
            {
                fuelSurcharge: {
                    enabled: true
                }
            },
            undefined,
            100,
            500
        );

        expect(calculateFuelSurcharge)
            .toHaveBeenCalledWith(
                {
                    fuelSurcharge: {
                        enabled: true
                    }
                },
                100
            );

        expect(result).toEqual({
            price: 105,
            unit: '€/kg'
        });

    });

});

describe('calculateWeightVolume', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const zone = {
        calculationMode: 'pallet',
        name: 'Madrid',
        volumetric: true,
        pricingMode: {
            type: 'weight_volume'
        }
    };

    it('should return empty array when rate does not exist', () => {

        getEffectiveWeight.mockReturnValue(500);

        const result = calculateWeightVolume({
            palletItems: [
                {}
            ],
            agencyRates: new Map(),
            zone,
            agencySupplements: {}
        });

        expect(result).toEqual([]);

    });

    it('should ignore services without matching price', () => {

        getEffectiveWeight.mockReturnValue(500);

        matchPrice.mockReturnValue(null);

        const agencyRates = new Map([
            [
                'pallet|Madrid|none',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: []
                        }
                    ]
                }
            ]
        ]);

        const result = calculateWeightVolume({
            palletItems: [
                {}
            ],
            agencyRates,
            zone,
            agencySupplements: {}
        });

        expect(matchPrice).toHaveBeenCalled();

        expect(result).toEqual([]);

    });

    it('should build one service', () => {

        getEffectiveWeight
            .mockReturnValueOnce(500)
            .mockReturnValueOnce(500);

        matchPrice.mockReturnValue({
            price: 100
        });

        calculateFuelSurcharge.mockReturnValue(10);

        round.mockReturnValue(110);

        buildConcept.mockReturnValue({
            concept: 'BASE'
        });

        buildRateResult.mockReturnValue({
            service: 'EXPRESS'
        });

        const agencyRates = new Map([
            [
                'pallet|Madrid|none',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: []
                        }
                    ]
                }
            ]
        ]);

        const result = calculateWeightVolume({

            palletItems: [
                {},
                {}
            ],

            agencyRates,

            zone,

            agencySupplements: {}

        });

        expect(buildConcept).toHaveBeenCalled();

        expect(buildRateResult).toHaveBeenCalled();

        expect(result).toEqual([
            {
                service: 'EXPRESS'
            }
        ]);

    });

    it('should build multiple services', () => {

        getEffectiveWeight.mockReturnValue(1000);

        matchPrice.mockReturnValue({
            price: 100
        });

        calculateFuelSurcharge.mockReturnValue(10);

        round.mockReturnValue(110);

        buildConcept.mockReturnValue({
            concept: 'BASE'
        });

        buildRateResult
            .mockReturnValueOnce({
                service: 'EXPRESS'
            })
            .mockReturnValueOnce({
                service: 'STANDARD'
            });

        const agencyRates = new Map([
            [
                'pallet|Madrid|none',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: []
                        },
                        {
                            service: 'STANDARD',
                            priceBreaks: []
                        }
                    ]
                }
            ]
        ]);

        const result = calculateWeightVolume({

            palletItems: [
                {}
            ],

            agencyRates,

            zone,

            agencySupplements: {}

        });

        expect(buildRateResult)
            .toHaveBeenCalledTimes(2);

        expect(result)
            .toHaveLength(2);

    });

});

describe('calculateGroupServices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const palletType = {
        _id: {
            toString: () => '123'
        },
        name: 'EUR'
    };

    const zone = {
        calculationMode: 'pallet',
        name: 'Madrid'
    };

    it('should return empty array when rate does not exist', () => {

        const result = calculateGroupServices({

            groups: [
                {
                    palletType,
                    quantity: 2,
                    items: []
                }
            ],

            agencyRates: new Map(),

            zone,

            agencySupplements: {}

        });

        expect(result).toEqual([]);

    });

    it('should build NO_RATE incident when price does not match', () => {

        matchPrice.mockReturnValue(null);

        buildIncident.mockReturnValue({
            code: 'NO_RATE'
        });

        buildRateResult.mockReturnValue({
            service: 'EXPRESS'
        });

        const agencyRates = new Map([
            [
                'pallet|Madrid|123',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: []
                        }
                    ]
                }
            ]
        ]);

        calculateGroupServices({

            groups: [
                {
                    palletType,
                    quantity: 2,
                    items: ['A']
                }
            ],

            agencyRates,

            zone,

            agencySupplements: {}

        });

        expect(buildIncident).toHaveBeenCalledWith(
            'NO_RATE',
            {
                items: ['A']
            }
        );

        expect(buildRateResult).toHaveBeenCalled();

    });

    it('should build one service', () => {

        matchPrice.mockReturnValue({
            price: 100
        });

        calculateFuelSurcharge.mockReturnValue(10);

        round
            .mockReturnValueOnce(110)
            .mockReturnValueOnce(220);

        buildConcept.mockReturnValue({
            concept: 'BASE'
        });

        buildRateResult.mockReturnValue({
            service: 'EXPRESS'
        });

        const agencyRates = new Map([
            [
                'pallet|Madrid|123',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: []
                        }
                    ]
                }
            ]
        ]);

        const result = calculateGroupServices({

            groups: [
                {
                    palletType,
                    quantity: 2,
                    items: []
                }
            ],

            agencyRates,

            zone,

            agencySupplements: {}

        });

        expect(calculateFuelSurcharge).toHaveBeenCalled();

        expect(buildConcept).toHaveBeenCalled();

        expect(buildRateResult).toHaveBeenCalled();

        expect(result).toEqual([
            {
                service: 'EXPRESS'
            }
        ]);

    });

    it('should build multiple services', () => {

        matchPrice.mockReturnValue({
            price: 50
        });

        calculateFuelSurcharge.mockReturnValue(5);

        round.mockReturnValue(55);

        buildConcept.mockReturnValue({});

        buildRateResult
            .mockReturnValueOnce({
                service: 'EXPRESS'
            })
            .mockReturnValueOnce({
                service: 'STANDARD'
            });

        const agencyRates = new Map([
            [
                'pallet|Madrid|123',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: []
                        },
                        {
                            service: 'STANDARD',
                            priceBreaks: []
                        }
                    ]
                }
            ]
        ]);

        const result = calculateGroupServices({

            groups: [
                {
                    palletType,
                    quantity: 2,
                    items: []
                }
            ],

            agencyRates,

            zone,

            agencySupplements: {}

        });

        expect(buildRateResult)
            .toHaveBeenCalledTimes(2);

        expect(result)
            .toHaveLength(2);

    });

});

describe('calculateSinglePallet', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const palletType = {
        _id: '123',
        name: 'EUR'
    };

    const params = {

        palletItems: [
            {
                id: 1
            }
        ],

        agencyRates: new Map(),

        agencyPalletTypes: [
            palletType
        ],

        zone: {
            calculationMode: 'pallet',
            name: 'Madrid'
        },

        agencySupplements: {}

    };

    it('should call groupPallets', () => {

        groupPallets.mockReturnValue({
            groups: [],
            rejected: []
        });

        buildRejectedServices.mockReturnValue([]);

        calculateSinglePallet(params);

        expect(groupPallets)
            .toHaveBeenCalledWith(
                params.palletItems,
                params.agencyPalletTypes
            );

    });

    it('should return only calculated services', () => {

        groupPallets.mockReturnValue({
            groups: [],
            rejected: []
        });

        buildRejectedServices.mockReturnValue([]);

        const result = calculateSinglePallet(params);

        expect(result).toEqual([]);

    });

    it('should append rejected services', () => {

        groupPallets.mockReturnValue({
            groups: [],
            rejected: [
                {
                    id: 99
                }
            ]
        });

        buildRejectedServices.mockReturnValue([
            {
                service: 'REJECTED'
            }
        ]);

        const result = calculateSinglePallet(params);

        expect(buildRejectedServices)
            .toHaveBeenCalledWith([
                {
                    id: 99
                }
            ]);

        expect(result).toEqual([
            {
                service: 'REJECTED'
            }
        ]);

    });

    it('should merge calculated and rejected services', () => {

        groupPallets.mockReturnValue({
            groups: [
                {
                    palletType: {
                        _id: {
                            toString: () => '123'
                        },
                        name: 'EUR'
                    },
                    quantity: 1,
                    items: []
                }
            ],
            rejected: [
                {
                    id: 10
                }
            ]
        });

        matchPrice.mockReturnValue({
            price: 20
        });

        calculateFuelSurcharge.mockReturnValue(0);

        buildConcept.mockReturnValue({});

        buildRateResult.mockReturnValue({
            service: 'EXPRESS'
        });

        buildRejectedServices.mockReturnValue([
            {
                service: 'REJECTED'
            }
        ]);

        const agencyRates = new Map([
            [
                'pallet|Madrid|123',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: []
                        }
                    ]
                }
            ]
        ]);

        const result = calculateSinglePallet({

            ...params,

            agencyRates

        });

        expect(result).toEqual([
            {
                service: 'EXPRESS'
            },
            {
                service: 'REJECTED'
            }
        ]);

    });

});