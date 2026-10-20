import {
    resolveAgencyRates,
    resolveAgencyZones
} from '../../../../src/lib/data/packages/agency-package.utils.js';
import cayco from '../../../../src/lib/data/packages/cayco.json' with { type: 'json' };
import correosexpress from '../../../../src/lib/data/packages/correosexpress.json' with { type: 'json' };
import mrw from '../../../../src/lib/data/packages/mrw.json' with { type: 'json' };
import rhenus from '../../../../src/lib/data/packages/rhenus.json' with { type: 'json' };
import tecum from '../../../../src/lib/data/packages/tecum.json' with { type: 'json' };

function createPalletTypes(agencyPackage) {
    return agencyPackage.palletTypes.map((type, index) => ({
        ...type,
        _id: `pallet-${index}`,
        constraints: {
            maxWeight: type.maxWeight,
            maxLength: type.maxLength,
            maxWidth: type.maxWidth,
            maxHeight: type.maxHeight
        }
    }));
}

describe('agency package resolution', () => {
    it.each([
        [cayco, 9, 51],
        [tecum, 21, 164],
        [correosexpress, 3, 5],
        [mrw, 2, 2],
        [rhenus, null, 509]
    ])('resolves static data for %s', (agencyPackage, zoneCount, rateCount) => {
        const palletTypes = createPalletTypes(agencyPackage);
        const rates = resolveAgencyRates(agencyPackage, palletTypes);

        expect(rates).toHaveLength(rateCount);

        if (zoneCount !== null) {
            expect(resolveAgencyZones(agencyPackage).zones).toHaveLength(zoneCount);
        }
    });

    it('applies nested zone overrides to the shared defaults', () => {
        const { zones } = resolveAgencyZones(cayco);
        const standardZone = zones.find(({ name }) => name === 'ZONA 1');
        const andaluciaZone = zones.find(({ name }) => name === 'ZONA 11');

        expect(standardZone.pricingMode).toEqual({
            type: 'pallet_classification',
            tonnagePricingRule: {
                enabled: false,
                threshold: 1001
            }
        });
        expect(andaluciaZone.pricingMode).toEqual({
            type: 'weight_volume',
            tonnagePricingRule: {
                enabled: true,
                threshold: 1001
            }
        });
    });

    it('preserves exceptions to shared rate defaults', () => {
        const caycoRates = resolveAgencyRates(cayco, createPalletTypes(cayco));
        const andaluciaRate = caycoRates.find(({ zoneName }) => zoneName === 'ZONA 11');
        const correosRates = resolveAgencyRates(correosexpress, []);
        const portugalRate = correosRates.find(({ zoneName }) => zoneName === 'PORTUGAL');

        expect(andaluciaRate.services[0].fallbackToLastPrice).toBe(false);
        expect(portugalRate.services[0].surcharges.fixedSurcharge).toEqual({
            enabled: true,
            calculateByQuantity: true,
            price: 1.2
        });
    });

    it('does not mutate package defaults while resolving nested services', () => {
        const originalDefaults = structuredClone(correosexpress.defaults.service);

        resolveAgencyRates(correosexpress, []);
        resolveAgencyRates(correosexpress, []);

        expect(correosexpress.defaults.service).toEqual(originalDefaults);
    });

    it('preserves rates for duplicate pallet names using their declared index', () => {
        const palletTypes = createPalletTypes(tecum).reverse();
        const rates = resolveAgencyRates(tecum, palletTypes);
        const duplicateNameRates = rates.filter(rate =>
            rate.zoneName === 'ZONA 21' &&
            [6, 7].includes(Number(rate.palletTypeId.split('-')[1]))
        );

        expect(duplicateNameRates.map(({ palletTypeId }) => palletTypeId)).toEqual([
            'pallet-6',
            'pallet-7'
        ]);
    });

    it('uses dynamic zones while retaining the Rhenus JSON defaults', () => {
        const dynamicZones = [{
            name: 'Austria-WI-10',
            provinces: ['AT-WI']
        }];
        const resolved = resolveAgencyZones(rhenus, {
            zones: dynamicZones,
            rules: { exceptions: [{ zoneName: 'Austria-WI-10' }] }
        });

        expect(resolved.zones[0]).toMatchObject({
            ...rhenus.defaults.zone,
            ...dynamicZones[0]
        });
        expect(resolved.rules.exceptions).toEqual([
            { zoneName: 'Austria-WI-10' }
        ]);
    });

    it('fails clearly when a package references an unknown pallet type', () => {
        expect(() => resolveAgencyRates({
            code: 'example',
            rates: [{ zoneName: 'NATIONAL', palletTypeIndex: 1 }]
        }, [])).toThrow('Pallet type index 1 not found for example');
    });
});
