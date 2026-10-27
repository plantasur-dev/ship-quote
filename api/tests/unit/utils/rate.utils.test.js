
import {
    calculateVolume,
    calculateVolumeM3,
    fixedToN,
    loadDataStaticRate,
    calculateVolumetricWeight,
    calculateChargeableWeight,
    resolveVolumetricFactor
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
    it('converts cubic centimeters to cubic meters', () => {
        const result = calculateVolumeM3({
            large: 100,
            width: 100,
            height: 100
        });

        expect(result).toBe(1);
    });

    it('preserves fractional cubic meters without intermediate rounding', () => {
        expect(calculateVolumeM3({
            large: 100,
            width: 100,
            height: 50
        })).toBe(0.5);
    });
});

describe('volumetric factor and weight', () => {
    it('prefers an enabled zone factor over the agency factor', () => {
        expect(resolveVolumetricFactor(
            { enabled: true, factor: 250 },
            { enabled: true, factor: 300 }
        )).toBe(250);
    });

    it('uses the agency factor when the zone factor is disabled', () => {
        expect(resolveVolumetricFactor(
            { enabled: false, factor: 200 },
            { enabled: true, factor: 300 }
        )).toBe(300);
    });

    it('returns no factor when zone and agency volumetric calculation are disabled', () => {
        expect(resolveVolumetricFactor(
            { enabled: false, factor: 200 },
            { enabled: false, factor: 300 }
        )).toBeNull();
    });

    it('calculates chargeable volumetric weight in kilograms', () => {
        expect(calculateVolumetricWeight(1.25, 300)).toBe(375);
        expect(calculateVolumetricWeight(1.25, null)).toBeNull();
    });

    it('uses the greater of real and volumetric weight, or real weight without a factor', () => {
        expect(calculateChargeableWeight(100, 1.25, 300)).toBe(375);
        expect(calculateChargeableWeight(400, 1.25, 300)).toBe(400);
        expect(calculateChargeableWeight(100, 1.25, null)).toBe(100);
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
