
import {
    resolveZone,
    matchDimensions
} from '../../../../../../src/api/services/rates/domains/zone/zone.rules.js';

describe('resolveZone', () => {
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
