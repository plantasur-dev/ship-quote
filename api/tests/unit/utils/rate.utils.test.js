
import {
    calculateVolume,
    calculateVolumeM3,
    fixedToN,
    loadDataStaticRate
} from '../../../src/lib/utils/rate.utils.js';

/**
 * Este archivo ya no incluye tests de getEffectiveWeight, classifyPallet,
 * groupPallets, resolveZone, matchPrice, calculateFuelSurcharge,
 * calculateExcessWeight, calculateAdditionalWeightBlockCost ni
 * matchDimensions: esas reglas de negocio se movieron a
 * `services/rates/domains/` y sus tests viven ahora junto a ellas (ver
 * `tests/unit/services/rates/domains/`).
 */

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

    it('should use default pallet volume when volume quantity is 0', () => {
        const result = calculateVolumeM3(
            {
                large: 100,
                width: 100,
                height: 100
            },
            0
        );

        expect(result).toBe(1);
    });

    it('should use fallback default volume when environment variable is not defined', () => {
        delete process.env.DEFAULT_PALLET_VOLUME;

        const result = calculateVolumeM3({
            large: 100,
            width: 100,
            height: 100
        });

        expect(result).toBe(1);
    });
});

describe('fixedToN', () => {
    it('should fixedToN to two default decimals', () => {
        expect(fixedToN(10.126)).toBe(10.13);
    });

    it('should keep two decimal precision', () => {
        expect(fixedToN(10.121)).toBe(10.12);
    });

    it('should fixedToN to three decimals', () => {
        expect(fixedToN(10.121655, 3)).toBe(10.122);
    });
});

describe('loadDataStaticRate', () => {
    it('should read agency data from the tariff store by agency id', () => {
        const tariffStore = {
            '1': {
                zones: ['zoneA'],
                zoneRules: ['ruleA'],
                ratesByKey: { key: 'rate' },
                sortedPalletTypes: ['typeA']
            }
        };

        const agency = {
            id: { toString: () => '1' },
            supplements: { fuelSurcharge: { enabled: true } }
        };

        const result = loadDataStaticRate(agency, tariffStore);

        expect(result).toEqual({
            agencyData: tariffStore['1'],
            agencySupplements: agency.supplements,
            agencyZones: ['zoneA'],
            agencyZonesRules: ['ruleA'],
            agencyRates: { key: 'rate' },
            agencyPalletTypes: ['typeA']
        });
    });
});
