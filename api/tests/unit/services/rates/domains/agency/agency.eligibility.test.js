
import {
    isAgencyEligibleFor,
    filterEligibleAgencies,
    filterItemsBySupportedUnits
} from '../../../../../../src/api/services/rates/domains/agency/agency.eligibility.js';

/**
 * Esta regla antes estaba duplicada e implementada de forma distinta en
 * `static.rate.provider.js` y en `providers/api/carriers/*` (ver
 * CarrierService.getRates y DachserService). Ahora es una única función,
 * usada en ambos sitios.
 */

describe('isAgencyEligibleFor', () => {
    it('should be eligible when agency supports pallets and pallets are present', () => {
        const agency = { rules: { supportsPallets: true, supportsParcels: false } };

        expect(
            isAgencyEligibleFor(agency, new Set(['pallet']))
        ).toBe(true);
    });

    it('should not be eligible when agency does not support the present unit', () => {
        const agency = { rules: { supportsPallets: true, supportsParcels: false } };

        expect(
            isAgencyEligibleFor(agency, new Set(['parcel']))
        ).toBe(false);
    });

    it('should be eligible when agency supports at least one of several present units', () => {
        const agency = { rules: { supportsPallets: false, supportsParcels: true } };

        expect(
            isAgencyEligibleFor(agency, new Set(['pallet', 'parcel']))
        ).toBe(true);
    });
});

describe('filterEligibleAgencies', () => {
    const agencies = [
        { name: 'OnlyPallets', rules: { supportsPallets: true, supportsParcels: false } },
        { name: 'OnlyParcels', rules: { supportsPallets: false, supportsParcels: true } },
        { name: 'Both', rules: { supportsPallets: true, supportsParcels: true } }
    ];

    it('should keep agencies matching the item types present', () => {
        const items = [{ typeServices: 'pallet' }];

        const result = filterEligibleAgencies(agencies, items);

        expect(result.map(a => a.name)).toEqual(['OnlyPallets', 'Both']);
    });

    it('should keep agencies for mixed shipments', () => {
        const items = [{ typeServices: 'pallet' }, { typeServices: 'parcel' }];

        const result = filterEligibleAgencies(agencies, items);

        expect(result.map(a => a.name)).toEqual(['OnlyPallets', 'OnlyParcels', 'Both']);
    });
});

describe('filterItemsBySupportedUnits', () => {
    it('should only keep items the agency supports', () => {
        const agency = { rules: { supportsPallets: true, supportsParcels: false } };

        const items = [
            { typeServices: 'pallet', id: 1 },
            { typeServices: 'parcel', id: 2 }
        ];

        const result = filterItemsBySupportedUnits(agency, items);

        expect(result).toEqual([{ typeServices: 'pallet', id: 1 }]);
    });
});
