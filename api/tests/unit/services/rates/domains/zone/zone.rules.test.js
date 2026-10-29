
import { readFileSync } from 'node:fs';

import { buildAgencyDocuments } from '../../../../../../src/api/services/integrator/apply.package.js';
import { validateAgencyPackage } from '../../../../../../src/api/services/integrator/validator.package.js';
import {
    resolveZone,
    matchDimensions
} from '../../../../../../src/api/services/rates/domains/zone/zone.rules.js';

const tecumPackage = JSON.parse(
    readFileSync(
        new URL('../../../../../../src/lib/data/rate.packages/tecum.json', import.meta.url),
        'utf8'
    )
);

const kuehneNagelPackage = JSON.parse(
    readFileSync(
        new URL('../../../../../../src/lib/data/rate.packages/kuehne_nagel.json', import.meta.url),
        'utf8'
    )
);

describe('buildAgencyDocuments', () => {
    it('preserves price-break weight-unit pricing from agency packages', () => {
        validateAgencyPackage(kuehneNagelPackage);

        const documents = buildAgencyDocuments(kuehneNagelPackage, 'agency-kuehne-nagel');
        const rate = documents.rates.find(({ zoneName }) => zoneName === 'Austria-ZONA-1');
        const priceBreak = rate.services[0].priceBreaks.find(({ min }) => min === 1001);

        expect(priceBreak).toMatchObject({
            max: 2000,
            price: 39.65,
            pricing: {
                type: 'per_weight_unit',
                unitKg: 100,
                unit: '€/100kg'
            }
        });
    });
});

describe('resolveZone', () => {
    it('should resolve Tecum island postal code ranges to their configured zones', () => {
        validateAgencyPackage(tecumPackage);

        const documents = buildAgencyDocuments(tecumPackage, 'agency-tecum');
        const zonesById = new Map(
            documents.zones.map(zone => [zone._id.toString(), zone])
        );
        const zoneRulesByProvince = new Map();
        const zoneExceptionsByPostalCode = new Map();

        for (const rule of documents.zoneRules) {
            const provinceRules = zoneRulesByProvince.get(rule.province) ?? [];
            provinceRules.push(rule);
            zoneRulesByProvince.set(rule.province, provinceRules);

            for (const range of rule.postalCodeRanges) {
                if (range.kind !== 'exception') continue;

                const exceptions = zoneExceptionsByPostalCode.get(rule.province) ?? new Map();
                for (let postalCode = Number(range.from); postalCode <= Number(range.to); postalCode++) {
                    exceptions.set(
                        String(postalCode).padStart(range.from.length, '0'),
                        rule
                    );
                }
                zoneExceptionsByPostalCode.set(rule.province, exceptions);
            }
        }

        const agencyData = {
            zoneExceptionsByPostalCode,
            zoneRangePostalByPostalCode: new Map(),
            zoneRulesByProvince,
            zonesById
        };

        for (const postalCode of ['35000', '35499']) {
            expect(resolveZone(agencyData, postalCode, 'ES-GC-LA')?.name)
                .toBe('ZONA 11');
        }

        for (const postalCode of ['35500', '35599', '35600', '35627']) {
            expect(resolveZone(agencyData, postalCode, 'ES-GC-LA')?.name)
                .toBe('ZONA 12');
        }

        for (const postalCode of ['38000', '38001', '38699']) {
            expect(resolveZone(agencyData, postalCode, 'ES-TF-EH')?.name)
                .toBe('ZONA 11');
        }

        for (const postalCode of ['38700', '38770', '38800', '38840', '38900', '38917']) {
            expect(resolveZone(agencyData, postalCode, 'ES-TF-EH')?.name)
                .toBe('ZONA 12');
        }
    });

    it('should return postal code zone', () => {
        const zone = { _id: 'zone1' };

        const agencyData = {
            zoneRangePostalByPostalCode: new Map([
                [
                    'ES-M',
                    new Map([
                        ['28', { zoneId: 'zone1' }]
                    ])
                ]
            ]),
            zoneRulesByProvince: new Map(),
            zonesById: new Map([
                ['zone1', zone]
            ])
        };

        expect(
            resolveZone(agencyData, '28000', 'ES-M')
        ).toEqual(zone);
    });

    it('should return default province zone', () => {
        const zone = { _id: 'zone1' };

        const agencyData = {
            zoneRangePostalByPostalCode: new Map(),
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
            zoneRangePostalByPostalCode: new Map(),
            zoneRulesByProvince: new Map(),
            zonesById: new Map()
        };

        expect(
            resolveZone(agencyData, '28001', 'ES-M')
        ).toBeNull();
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
