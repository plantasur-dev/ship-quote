
import {
    buildRateComplete,
    buildRateResult,
    buildConcept,
    buildIncident,
    buildParcelRate,
    buildApiErrorResult,
    buildStaticErrorResult,
    buildRejectedServices
} from '../../../../../src/api/services/rates/domains/build.rate.result.js';

describe('buildConcept / buildIncident', () => {
    it('should round the amount to 2 decimals', () => {
        expect(buildConcept('BASE', 10.126)).toEqual({
            code: 'BASE',
            amount: 10.13,
            meta: {}
        });
    });

    it('should build an incident with meta', () => {
        expect(buildIncident('NO_RATE', { foo: 'bar' })).toEqual({
            code: 'NO_RATE',
            meta: { foo: 'bar' }
        });
    });
});

describe('buildRateResult - fuel surcharge', () => {

    it('should not add a FUEL_SURCHARGE concept when there are no agencySupplements', () => {
        const result = buildRateResult({
            service: 'TEST',
            transportType: 'pallet',
            concepts: [{ code: 'BASE', amount: 50, meta: {} }]
        });

        expect(result.total).toBe(50);
        expect(result.concepts).toHaveLength(1);
    });

    it('should not add a FUEL_SURCHARGE concept when fuel is disabled', () => {
        const result = buildRateResult({
            service: 'TEST',
            transportType: 'pallet',
            concepts: [{ code: 'BASE', amount: 50, meta: {} }],
            agencySupplements: { fuelSurcharge: { enabled: false, type: 'percentage', value: 10 } }
        });

        expect(result.total).toBe(50);
        expect(result.concepts).toHaveLength(1);
    });

    it('should apply a percentage fuel surcharge over the TOTAL (all concepts summed), not per concept', () => {
        const result = buildRateResult({
            service: 'TEST',
            transportType: 'pallet',
            concepts: [
                { code: 'BASE', amount: 100, meta: {} },
                { code: 'EXTRA_WEIGHT', amount: 20, meta: {} }
            ],
            agencySupplements: { fuelSurcharge: { enabled: true, type: 'percentage', value: 10 } }
        });

        // (100 + 20) * 10% = 12 -> total = 132
        expect(result.total).toBe(132);

        const fuelConcept = result.concepts.find(c => c.code === 'FUEL_SURCHARGE');
        expect(fuelConcept).toEqual({ code: 'FUEL_SURCHARGE', amount: 12, meta: {} });
    });

    it('should apply a fixed fuel surcharge as a flat amount', () => {
        const result = buildRateResult({
            service: 'TEST',
            transportType: 'pallet',
            concepts: [{ code: 'BASE', amount: 50, meta: {} }],
            agencySupplements: { fuelSurcharge: { enabled: true, type: 'fixed', value: 5 } }
        });

        expect(result.total).toBe(55);
    });
});

describe('buildRateComplete', () => {
    it('should be available when at least one service has no incidents', () => {
        const result = buildRateComplete({
            agency: 'DHL',
            zone: 'NACIONAL',
            services: [
                { incidents: [{ code: 'NO_RATE' }] },
                { incidents: [] }
            ]
        });

        expect(result.available).toBe(true);
    });

    it('should not be available when every service has incidents', () => {
        const result = buildRateComplete({
            agency: 'DHL',
            zone: 'NACIONAL',
            services: [
                { incidents: [{ code: 'NO_RATE' }] }
            ]
        });

        expect(result.available).toBe(false);
    });
});

describe('buildParcelRate', () => {
    it('should build a parcel result carrying agencySupplements through', () => {
        const result = buildParcelRate({
            serviceName: 'express',
            totalWeight: 10,
            itemCount: 1,
            concepts: [{ code: 'BASE', amount: 100, meta: {} }],
            agencySupplements: { fuelSurcharge: { enabled: true, type: 'percentage', value: 10 } }
        });

        expect(result.transportType).toBe('parcel');
        expect(result.total).toBe(110);
    });
});

describe('buildApiErrorResult / buildStaticErrorResult', () => {
    it('buildApiErrorResult should use the zone received explicitly (no env fallback)', () => {
        const result = buildApiErrorResult({
            agency: 'DHL',
            zone: 'INTERNACIONAL',
            error: { status: 500, message: 'boom' }
        });

        expect(result.zone).toBe('INTERNACIONAL');
        expect(result.available).toBe(false);
        expect(result.services[0].incidents[0].code).toBe('API_ERROR');
    });

    it('buildStaticErrorResult should use the zone received explicitly (no env fallback)', () => {
        const result = buildStaticErrorResult({
            agency: 'DHL',
            zone: 'INTERNACIONAL',
            code: 'ZONE_NOT_FOUND'
        });

        expect(result.zone).toBe('INTERNACIONAL');
        expect(result.services[0].service).toBe('ZONE_NOT_FOUND');
    });

    it('buildStaticErrorResult should leave zone undefined when the caller does not provide one', () => {
        const result = buildStaticErrorResult({
            agency: 'DHL',
            code: 'ZONE_NOT_FOUND'
        });

        expect(result.zone).toBeUndefined();
    });
});

describe('buildRejectedServices', () => {
    it('should return an empty array when there is nothing rejected', () => {
        expect(buildRejectedServices([])).toEqual([]);
    });

    it('should build one REJECTED_PALLET result with one incident per rejected item', () => {
        const result = buildRejectedServices([{ id: 1 }, { id: 2 }]);

        expect(result).toHaveLength(1);
        expect(result[0].service).toBe('REJECTED_PALLET');
        expect(result[0].incidents).toHaveLength(2);
    });
});
