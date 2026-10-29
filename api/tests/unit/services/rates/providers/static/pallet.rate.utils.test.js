
import {
    calculateWeightVolume,
    calculateGroupServices,
    calculatePalletBasedPricing
} from '../../../../../../src/api/services/rates/providers/static/pallet.rate.utils.js';

import {
    getEffectiveWeight,
    groupPallets
} from '../../../../../../src/api/services/rates/domains/pallet/pallet.rules.js';

import {
    matchPrice,
    calculatePriceBreakPricing
} from '../../../../../../src/api/services/rates/domains/pricing/pricing.rules.js';

import {
    buildRateResult,
    buildConcept,
    buildRejectedServices,
    buildIncident
} from '../../../../../../src/api/services/rates/domains/build.rate.result.js';

/**
 * Antes este archivo mockeaba `lib/utils/rate.utils.js` (getEffectiveWeight,
 * matchPrice, calculateFuelSurcharge, groupPallets vivían ahí). Ahora esas
 * reglas viven en domains/, así que se mockean por separado, cada una desde
 * su módulo.
 *
 * El fuel ya no se calcula en pallet.rate.utils.js: se aplica una única vez
 * dentro de `buildRateResult` (domains/build.rate.result.js), así que ya no
 * hay que mockear/verificar `calculateFuelSurcharge` aquí. En su lugar,
 * comprobamos que `agencySupplements` se reenvía a `buildRateResult`.
 */

vi.mock(
    '../../../../../../src/api/services/rates/domains/pallet/pallet.rules.js',
    () => ({
        getEffectiveWeight: vi.fn(),
        groupPallets: vi.fn()
    })
);

vi.mock(
    '../../../../../../src/api/services/rates/domains/pricing/pricing.rules.js',
    () => ({
        matchPrice: vi.fn(),
        calculatePriceBreakPricing: vi.fn()
    })
);

vi.mock(
    '../../../../../../src/api/services/rates/domains/build.rate.result.js',
    () => ({
        buildRateResult: vi.fn(),
        buildConcept: vi.fn(),
        buildRejectedServices: vi.fn(),
        buildIncident: vi.fn()
    })
);

describe('calculateWeightVolume', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const zone = {
        calculationMode: 'pallet',
        name: 'Madrid',
        volumetric: { enabled: true, factor: 250 },
        pricingMode: {
            type: 'weight_volume'
        }
    };

    it('should return empty array when rate does not exist', () => {

        getEffectiveWeight.mockReturnValue(500);

        const result = calculateWeightVolume({
            palletItems: [{}],
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
                        { service: 'EXPRESS', priceBreaks: [] }
                    ]
                }
            ]
        ]);

        const result = calculateWeightVolume({
            palletItems: [{}],
            agencyRates,
            zone,
            agencySupplements: {}
        });

        expect(matchPrice).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('uses the last price break when weight-volume fallback is enabled', () => {
        getEffectiveWeight.mockReturnValue(3500);
        matchPrice.mockReturnValue({ min: 2001, max: 3000, price: 336.6 });
        calculatePriceBreakPricing.mockReturnValue({ price: 1178.1, unit: '€/t' });
        buildConcept.mockReturnValue({ concept: 'BASE' });
        buildRateResult.mockReturnValue({ service: 'EXPRESS' });

        const agencyRates = new Map([
            [
                'pallet|Madrid|none',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: [{ min: 2001, max: 3000, price: 336.6 }],
                            fallbackToLastPrice: true
                        }
                    ]
                }
            ]
        ]);

        calculateWeightVolume({
            palletItems: [{}],
            agencyRates,
            zone,
            agencySupplements: {}
        });

        expect(matchPrice).toHaveBeenCalledWith(
            agencyRates.get('pallet|Madrid|none').services[0].priceBreaks,
            3500,
            true
        );
    });

    it('rejects weight-volume quotes above the service maxWeight limit', () => {
        getEffectiveWeight.mockReturnValue(3000.01);
        buildIncident.mockReturnValue({
            code: 'MAX_WEIGHT_EXCEEDED',
            meta: { maxWeight: 3000, currentWeight: 3000.01 }
        });
        buildRateResult.mockReturnValue({
            service: 'EXPRESS',
            incidents: [{ code: 'MAX_WEIGHT_EXCEEDED' }]
        });

        const agencyRates = new Map([
            [
                'pallet|Madrid|none',
                {
                    services: [
                        {
                            service: 'EXPRESS',
                            priceBreaks: [{ min: 2000, max: 3000, price: 336.6 }],
                            fallbackToLastPrice: true,
                            limits: { maxWeight: 3000 }
                        }
                    ]
                }
            ]
        ]);

        const result = calculateWeightVolume({
            palletItems: [{}],
            agencyRates,
            zone,
            agencySupplements: {}
        });

        expect(matchPrice).not.toHaveBeenCalled();
        expect(buildIncident).toHaveBeenCalledWith('MAX_WEIGHT_EXCEEDED', {
            maxWeight: 3000,
            currentWeight: 3000.01
        });
        expect(result).toEqual([
            {
                service: 'EXPRESS',
                incidents: [{ code: 'MAX_WEIGHT_EXCEEDED' }]
            }
        ]);
    });

    it('should build one service and forward agencySupplements to buildRateResult', () => {

        getEffectiveWeight
            .mockReturnValueOnce(500)
            .mockReturnValueOnce(500);

        matchPrice.mockReturnValue({ price: 100 });

        calculatePriceBreakPricing.mockReturnValue({ price: 100, unit: '€/kg' });

        buildConcept.mockReturnValue({ concept: 'BASE' });

        buildRateResult.mockReturnValue({ service: 'EXPRESS' });

        const agencyRates = new Map([
            [
                'pallet|Madrid|none',
                {
                    services: [
                        { service: 'EXPRESS', priceBreaks: [] }
                    ]
                }
            ]
        ]);

        const agencySupplements = { fuelSurcharge: { enabled: true } };
        const agencyVolumetric = { enabled: true, factor: 300 };

        const result = calculateWeightVolume({
            palletItems: [{}, {}],
            agencyRates,
            zone,
            agencyVolumetric,
            agencySupplements
        });

        expect(getEffectiveWeight).toHaveBeenNthCalledWith(
            1,
            {},
            250
        );
        expect(getEffectiveWeight).toHaveBeenNthCalledWith(2, {}, 250);
        expect(calculatePriceBreakPricing).toHaveBeenCalledWith(
            { price: 100 },
            undefined,
            1000
        );
        expect(buildConcept).toHaveBeenCalled();

        expect(buildRateResult).toHaveBeenCalledWith({
            service: 'EXPRESS',
            transportType: 'pallet',
            itemCount: 2,
            totalWeight: 1000,
            concepts: [{ concept: 'BASE' }],
            agencySupplements
        });

        expect(result).toEqual([{ service: 'EXPRESS' }]);
    });

    it('should build multiple services', () => {

        getEffectiveWeight.mockReturnValue(1000);

        matchPrice.mockReturnValue({ price: 100 });

        calculatePriceBreakPricing.mockReturnValue({ price: 100, unit: '€/kg' });

        buildConcept.mockReturnValue({ concept: 'BASE' });

        buildRateResult
            .mockReturnValueOnce({ service: 'EXPRESS' })
            .mockReturnValueOnce({ service: 'STANDARD' });

        const agencyRates = new Map([
            [
                'pallet|Madrid|none',
                {
                    services: [
                        { service: 'EXPRESS', priceBreaks: [] },
                        { service: 'STANDARD', priceBreaks: [] }
                    ]
                }
            ]
        ]);

        const result = calculateWeightVolume({
            palletItems: [{}],
            agencyRates,
            zone,
            agencySupplements: {}
        });

        expect(buildRateResult).toHaveBeenCalledTimes(2);
        expect(result).toHaveLength(2);
    });
});

describe('calculateGroupServices', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const palletType = {
        _id: { toString: () => '123' },
        name: 'EUR'
    };

    const zone = {
        calculationMode: 'pallet',
        name: 'Madrid'
    };

    it('should return empty array when rate does not exist', () => {

        const result = calculateGroupServices({
            groups: [{ palletType, quantity: 2, items: [] }],
            agencyRates: new Map(),
            zone,
            agencySupplements: {}
        });

        expect(result).toEqual([]);
    });

    it('should build NO_RATE incident when price does not match', () => {

        matchPrice.mockReturnValue(null);

        buildIncident.mockReturnValue({ code: 'NO_RATE' });

        buildRateResult.mockReturnValue({ service: 'EXPRESS' });

        const agencyRates = new Map([
            [
                'pallet|Madrid|123',
                { services: [{ service: 'EXPRESS', priceBreaks: [] }] }
            ]
        ]);

        calculateGroupServices({
            groups: [{ palletType, quantity: 2, items: ['A'] }],
            agencyRates,
            zone,
            agencySupplements: {}
        });

        expect(buildIncident).toHaveBeenCalledWith('NO_RATE', { items: ['A'] });
        expect(buildRateResult).toHaveBeenCalled();
    });

    it('should build one service without calculating fuel here (fuel is centralized in buildRateResult)', () => {

        matchPrice.mockReturnValue({ price: 100 });

        buildConcept.mockReturnValue({ concept: 'BASE' });

        buildRateResult.mockReturnValue({ service: 'EXPRESS' });

        const agencyRates = new Map([
            [
                'pallet|Madrid|123',
                { services: [{ service: 'EXPRESS', priceBreaks: [] }] }
            ]
        ]);

        const agencySupplements = { fuelSurcharge: { enabled: true } };

        const result = calculateGroupServices({
            groups: [{ palletType, quantity: 2, items: [] }],
            agencyRates,
            zone,
            agencySupplements
        });

        expect(buildConcept).toHaveBeenCalledWith(
            'BASE',
            200,
            {
                palletType: 'EUR',
                quantity: 2,
                unitPrice: 100,
                items: []
            }
        );

        expect(buildRateResult).toHaveBeenCalled();

        expect(result).toEqual([{ service: 'EXPRESS' }]);
    });

    it('should build multiple services', () => {

        matchPrice.mockReturnValue({ price: 50 });

        buildConcept.mockReturnValue({});

        buildRateResult
            .mockReturnValueOnce({ service: 'EXPRESS' })
            .mockReturnValueOnce({ service: 'STANDARD' });

        const agencyRates = new Map([
            [
                'pallet|Madrid|123',
                {
                    services: [
                        { service: 'EXPRESS', priceBreaks: [] },
                        { service: 'STANDARD', priceBreaks: [] }
                    ]
                }
            ]
        ]);

        const result = calculateGroupServices({
            groups: [{ palletType, quantity: 2, items: [] }],
            agencyRates,
            zone,
            agencySupplements: {}
        });

        expect(buildRateResult).toHaveBeenCalledTimes(2);
        expect(result).toHaveLength(2);
    });
});

describe('calculatePalletBasedPricing', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const palletType = { _id: '123', name: 'EUR' };

    const params = {
        palletItems: [{ id: 1 }],
        agencyRates: new Map(),
        agencyPalletTypes: [palletType],
        zone: { calculationMode: 'pallet', name: 'Madrid' },
        agencySupplements: {}
    };

    it('should call groupPallets', () => {

        groupPallets.mockReturnValue({ groups: [], rejected: [] });

        buildRejectedServices.mockReturnValue([]);

        calculatePalletBasedPricing(params);

        expect(groupPallets).toHaveBeenCalledWith(
            params.palletItems,
            params.agencyPalletTypes
        );
    });

    it('should return only calculated services', () => {

        groupPallets.mockReturnValue({ groups: [], rejected: [] });

        buildRejectedServices.mockReturnValue([]);

        const result = calculatePalletBasedPricing(params);

        expect(result).toEqual([]);
    });

    it('should append rejected services', () => {

        groupPallets.mockReturnValue({
            groups: [],
            rejected: [{ id: 99 }]
        });

        buildRejectedServices.mockReturnValue([{ service: 'REJECTED' }]);

        const result = calculatePalletBasedPricing(params);

        expect(buildRejectedServices).toHaveBeenCalledWith([{ id: 99 }]);
        expect(result).toEqual([{ service: 'REJECTED' }]);
    });

    it('should merge calculated and rejected services', () => {

        groupPallets.mockReturnValue({
            groups: [
                {
                    palletType: { _id: { toString: () => '123' }, name: 'EUR' },
                    quantity: 1,
                    items: []
                }
            ],
            rejected: [{ id: 10 }]
        });

        matchPrice.mockReturnValue({ price: 20 });

        buildConcept.mockReturnValue({});

        buildRateResult.mockReturnValue({ service: 'EXPRESS' });

        buildRejectedServices.mockReturnValue([{ service: 'REJECTED' }]);

        const agencyRates = new Map([
            [
                'pallet|Madrid|123',
                { services: [{ service: 'EXPRESS', priceBreaks: [] }] }
            ]
        ]);

        const result = calculatePalletBasedPricing({
            ...params,
            agencyRates
        });

        expect(result).toEqual([
            { service: 'EXPRESS' },
            { service: 'REJECTED' }
        ]);
    });
});
