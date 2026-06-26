
import {
    calculateParcelRate,
    calculateParcel
} from '../../../../src/api/services/rates/providers/static/parcel.rate.calculator.js';

function buildZone(pricingModeType = 'weight') {
    return {
        name: 'Madrid',
        calculationMode: 'parcel',
        pricingMode: {
            type: pricingModeType
        }
    };
}

function buildAgencyRates(services = []) {

    return new Map([
        [
            'parcel|Madrid|none', 
            { 
                type: 'parcel',
                calculationType: 'unit',
                services 
            }
        ]
    ]);
}

describe('calculateParcelRate', () => {
    it('returns an empty array when parcelItems is empty', () => {
        const result = calculateParcelRate({
            parcelItems: [],
            agencyRates: buildAgencyRates(),
            zone: buildZone(),
            agencySupplements: {}
        });

        expect(result).toEqual([]);
    });

    it('returns an empty array when there is no rate for the selected zone', () => {
        const result = calculateParcelRate({
            parcelItems: [{ weight: 1, large: 10, width: 10, height: 10 }],
            agencyRates: new Map(),
            zone: buildZone(),
            agencySupplements: {}
        });

        expect(result).toEqual([]);
    });

    it('builds an incident when an item exceeds the allowed weight', () => {
        const result = calculateParcelRate({
            parcelItems: [{ weight: 2, large: 10, width: 10, height: 10 }],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 50, price: 10 }],
                    limits: { maxPieceWeight: 1 }
                }
            ]),
            zone: buildZone(),
            agencySupplements: {}
        });

        expect(result).toEqual([
            {
                service: 'express',
                transportType: 'parcel',
                itemCount: 0,
                totalWeight: 2,
                concepts: [],
                incidents: [
                    {
                        code: 'MAX_WEIGHT_EXCEEDED',
                        meta: {
                            maxWeight: 1,
                            currentWeight: 2
                        }
                    }
                ],
                total: 0
            }
        ]);
    });

    it('uses the real weight when the pricing mode is WEIGHT', () => {
        const result = calculateParcelRate({
            parcelItems: [{ weight: 1.4, large: 10, width: 10, height: 10 }],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 200, price: 10 }]
                }
            ]),
            zone: buildZone('weight'),
            agencySupplements: {}
        });

        expect(result[0]).toMatchObject({
            service: 'express',
            itemCount: 1,
            totalWeight: 2,
            incidents: [],
            concepts: [{ code: 'BASE', amount: 10 }]
        });
    });

    it('uses the volumetric weight when it is higher than the real weight', () => {
        const result = calculateParcelRate({
            parcelItems: [{ weight: 1, large: 100, width: 100, height: 100 }],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 200, price: 10 }]
                }
            ]),
            zone: buildZone('weight_volume'),
            agencySupplements: {}
        });

        expect(result[0]).toMatchObject({
            service: 'express',
            itemCount: 1,
            totalWeight: 167,
            incidents: [],
            concepts: [{ code: 'BASE', amount: 10 }]
        });
    });

    it('adds the extra dimensions concept when a parcel exceeds the standard dimensions', () => {
        const result = calculateParcelRate({
            parcelItems: [{ weight: 1, large: 100, width: 100, height: 100 }],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 200, price: 10 }],
                    surcharges: {
                        dimensionRanges: [{ min: 10, max: 340, price: 5 }],
                    },
                    limits: { maxPieceWeight: 10 }
                }
            ]),
            zone: buildZone('weight'),
            agencySupplements: {},
            calculationType: 'unit'
        });

        expect(result[0]).toMatchObject({
            service: 'express',
            itemCount: 1,
            totalWeight: 1,
            incidents: [],
            concepts: [
                { code: 'BASE', amount: 10 },
                { code: 'EXTRA_DIMENSIONS', amount: 5, meta: {} }
            ]
        });
    });

    it('returns a CALCULATION_ERROR incident when the pricing mode is invalid', () => {
        const result = calculateParcelRate({
            parcelItems: [{ weight: 1, large: 10, width: 10, height: 10 }],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 200, price: 10 }]
                }
            ]),
            zone: { ...buildZone('unsupported'), pricingMode: { type: 'unsupported' } },
            agencySupplements: {}
        });

        expect(result[0]).toMatchObject({
            service: 'express',
            incidents: [{ code: 'CALCULATION_ERROR' }]
        });
    });

    it('returns one result per valid item and preserves incidents for invalid ones', () => {
        const result = calculateParcelRate({
            parcelItems: [
                { weight: 1, large: 10, width: 10, height: 10 },
                { weight: 2, large: 10, width: 10, height: 10 }
            ],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 200, price: 10 }],
                    limits: { maxPieceWeight: 1.5 }
                }
            ]),
            zone: buildZone('weight'),
            agencySupplements: {}
        });

        expect(result).toEqual([
            {
                service: 'express',
                transportType: 'parcel',
                itemCount: 1,
                totalWeight: 1,
                concepts: [{ code: 'BASE', amount: 10, meta: {} }],
                incidents: [],
                total: 10
            },
            {
                service: 'express',
                transportType: 'parcel',
                itemCount: 0,
                totalWeight: 2,
                concepts: [],
                incidents: [
                    {
                        code: 'MAX_WEIGHT_EXCEEDED',
                        meta: {
                            maxWeight: 1.5,
                            currentWeight: 2
                        }
                    }
                ],
                total: 0
            }
        ]);
    });

    it('adds excess weight and additional block concepts when applicable', () => {
        const result = calculateParcelRate({
            parcelItems: [
                { weight: 10, large: 10, width: 10, height: 10 },
                { weight: 12, large: 10, width: 10, height: 10 }
            ],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 5, price: 10 }],
                    surcharges: {
                        extraKg: { enabled: true, pricePerKg: 2 },
                        multiParcelExcess: { enabled: true, thresholdKg: 5, divisor: 2, pricePerBlock: 4 }
                    }
                }
            ]),
            zone: buildZone('weight'),
            agencySupplements: {}
        });

        expect(result[0]).toMatchObject({
            service: 'express',
            totalWeight: 22,
            concepts: [
                { code: 'BASE', amount: 10 },
                { code: 'ADDITIONAL_BLOCK', amount: 36 },
                { code: 'EXTRA_WEIGHT', amount: 34 }
            ]
        });
    });

    it('returns one overall result per service when multiple services are configured', () => {
        const result = calculateParcelRate({
            parcelItems: [{ weight: 1, large: 10, width: 10, height: 10 }],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 200, price: 10 }]
                },
                {
                    service: 'priority',
                    priceBreaks: [{ min: 0, max: 200, price: 15 }]
                }
            ]),
            zone: buildZone('weight'),
            agencySupplements: {}
        });

        expect(result).toHaveLength(2);
        expect(result.map(item => item.service)).toEqual(['express', 'priority']);
    });
});

describe('calculateParcel', () => {
    it('returns a complete rate result when services are available', () => {
        const result = calculateParcel({
            parcelItems: [{ weight: 1, large: 10, width: 10, height: 10 }],
            agencyRates: buildAgencyRates([
                {
                    service: 'Express',
                    priceBreaks: [{ min: 0, max: 200, price: 10 }]
                }
            ]),
            zone: buildZone('weight'),
            agencySupplements: {},
            nameAgency: 'DHL'
        });

        expect(result).toMatchObject({
            agency: 'DHL',
            available: true,
            zone: 'Madrid',
            services: [
                {
                    service: 'Express',
                    total: 10,
                    itemCount: 1,
                    breakdown: [{ type: 'Tarifa base', price: 10 }],
                    incidents: []
                }
            ]
        });
    });

    it('returns a static error when no service can be priced', () => {
        const result = calculateParcel({
            parcelItems: [{ weight: 50, large: 10, width: 10, height: 10 }],
            agencyRates: buildAgencyRates([
                {
                    service: 'express',
                    priceBreaks: [{ min: 0, max: 10, price: 5 }],
                    limits: { maxPieceWeight: 10 }
                }
            ]),
            zone: {},
            agencySupplements: {},
            nameAgency: 'DHL'
        });

        expect(result).toMatchObject({
            agency: 'DHL',
            available: false,
            zone: 'NACIONAL',
            services: [
                {
                    service: 'Sin tarifa disponible',
                    incidents: [{ type: 'Sin tarifa disponible' }]
                }
            ]
        });
    });
});