
import { loadDataStaticRate } from '../../../../../../src/lib/utils/rate.utils.js';

import { getAgencyTariffs } from '../../../../../../src/api/services/cache.service.js';

import { getStaticRates } from '../../../../../../src/api/services/rates/index.js';
import { calculatePallet } from '../../../../../../src/api/services/rates/providers/static/pallet.rate.calculator.js';
import { calculateParcel } from '../../../../../../src/api/services/rates/providers/static/parcel.rate.calculator.js';

import { resolveZone } from '../../../../../../src/api/services/rates/domains/zone/zone.rules.js';
import { buildStaticErrorResult } from '../../../../../../src/api/services/rates/domains/build.rate.result.js';

import { presentAgencyRate } from '../../../../../../src/api/services/rates/presenters/rate.presenter.js';

/**
 * `resolveZone` se movió de `lib/utils/rate.utils.js` a
 * `domains/zone/zone.rules.js`: el mock ahora apunta ahí.
 *
 * `presentAgencyRate` sustituye a `presentRate` como punto único de
 * presentación, aplicado por `getStaticRates` sobre cada resultado por
 * agencia (tanto el camino feliz como los distintos errores). Se mockea
 * como identidad para poder seguir comprobando qué le llega desde el
 * orquestador, igual que antes se comprobaba con `presentRate`.
 *
 * La elegibilidad de agencia (antes un filtro inline por
 * hasPallets/hasParcels) ya no se mockea: es la regla real de
 * `domains/agency/agency.eligibility.js`, y las agencias de este test ya
 * declaran `rules.supportsPallets/supportsParcels` coherentes con los
 * items de `input`, así que el comportamiento no cambia.
 */

vi.mock('../../../../../../src/api/services/cache.service.js', () => ({
    getAgencyTariffs: vi.fn()
}));

vi.mock('../../../../../../src/lib/utils/rate.utils.js', () => ({
    loadDataStaticRate: vi.fn()
}));

vi.mock('../../../../../../src/api/services/rates/domains/zone/zone.rules.js', () => ({
    resolveZone: vi.fn()
}));

vi.mock('../../../../../../src/api/services/rates/providers/static/pallet.rate.calculator.js', () => ({
    calculatePallet: vi.fn()
}));

vi.mock('../../../../../../src/api/services/rates/providers/static/parcel.rate.calculator.js', () => ({
    calculateParcel: vi.fn()
}));

vi.mock('../../../../../../src/api/services/rates/domains/build.rate.result.js', () => ({
    buildStaticErrorResult: vi.fn()
}));

vi.mock('../../../../../../src/api/services/rates/presenters/rate.presenter.js', () => ({
    presentAgencyRate: vi.fn(result => result)
}));

const input = {
    destinationPostalCode: '28001',
    province: 'ES-M',
    zone: 'NACIONAL',
    items: [
        {
            typeServices: 'pallet',
            weight: 250,
            large: 120,
            width: 80,
            height: 150
        },
        {
            typeServices: 'parcel',
            weight: 12,
            large: 12,
            width: 8,
            height: 15
        }
    ]
};

const palletResult = [
    {
        "agency": "Cayco",
        "available": true,
        "zone": "ZONA 11",
        "services": [
            {
                "service": "economy",
                "total": 23.49,
                "itemCount": 1,
                "breakdown": []
            }
        ]
    }
];

const parcelResult = [
    {
        "agency": "Correosexpress",
        "available": true,
        "zone": "PENINSULAR",
        "services": [
            {
                "service": "basic",
                "total": 11.64,
                "itemCount": 1,
                "breakdown": []
            }
        ]
    }
];

describe('getStaticRates Services', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        presentAgencyRate.mockImplementation(result => result);
    });

    it('should handle loading tariff error', async () => {
        const agencies = [
            { id: { toString: () => '1' }, name: 'DHL' }
        ];

        getAgencyTariffs.mockImplementation(() => {
            throw new Error('fail');
        });

        resolveZone.mockReturnValue({ calculationMode: 'pallet' });

        await expect(getStaticRates(agencies, input)).rejects.toThrow('Data store not initialized');
    });

    it('should calculate pallet rates when zone mode is pallet', async () => {
        const agencies = [
            {
                id: { toString: () => '1' },
                name: 'DHL',
                type: 'hybrid',
                rules: {
                    hasAndaluciaRule: true,
                    supportsPallets: true,
                    supportsParcels: false
                },
            }
        ];

        getAgencyTariffs.mockReturnValue({
            1: { zones: [], zoneRules: [], ratesByKey: [], sortedPalletTypes: [] }
        });

        loadDataStaticRate.mockReturnValue({
            agencyData: {},
            agencySupplements: {},
            agencyRates: {},
            agencyPalletTypes: {}
        });

        resolveZone.mockReturnValue({ calculationMode: 'pallet' });

        calculatePallet.mockReturnValue(palletResult);

        const result = await getStaticRates(agencies, input);

        expect(calculatePallet).toHaveBeenCalled();
        expect(presentAgencyRate).toHaveBeenCalledWith(palletResult);
        expect(result).toEqual([palletResult]);
    });

    it('should calculate parcel rates when zone mode is not pallet', async () => {
        const agencies = [
            {
                id: { toString: () => '1' },
                name: 'UPS',
                type: 'hybrid',
                rules: {
                    hasAndaluciaRule: false,
                    supportsPallets: false,
                    supportsParcels: true
                },
            }
        ];

        getAgencyTariffs.mockReturnValue({ 1: { ratesByKey: [] } });

        loadDataStaticRate.mockReturnValue({
            agencyData: {},
            agencySupplements: {},
            agencyRates: {},
            agencyPalletTypes: {}
        });

        resolveZone.mockReturnValue({ calculationMode: 'parcel' });

        calculateParcel.mockReturnValue(parcelResult);

        const result = await getStaticRates(agencies, input);

        expect(calculateParcel).toHaveBeenCalled();
        expect(result).toEqual([parcelResult]);
    });

    it('should return zone error when zone is not found, using the default zone label from input', async () => {
        const agencies = [
            {
                id: { toString: () => '1' },
                name: 'DHL',
                type: 'hybrid',
                rules: {
                    hasAndaluciaRule: true,
                    supportsPallets: true,
                    supportsParcels: false
                },
            }
        ];

        getAgencyTariffs.mockReturnValue({ 1: {} });

        loadDataStaticRate.mockReturnValue({
            agencyData: {},
            agencySupplements: {},
            agencyRates: {},
            agencyPalletTypes: {}
        });

        resolveZone.mockReturnValue(null);

        buildStaticErrorResult.mockReturnValue('ZONE_NOT_FOUND');

        const result = await getStaticRates(agencies, input);

        expect(buildStaticErrorResult).toHaveBeenCalledWith({
            agency: 'DHL',
            zone: 'NACIONAL',
            code: 'ZONE_NOT_FOUND'
        });

        expect(result).toEqual(['ZONE_NOT_FOUND']);
    });

    it('should handle type calculation error', async () => {
        const agencies = [
            {
                id: { toString: () => '1' },
                name: 'DHL',
                type: 'hybrid',
                rules: {
                    hasAndaluciaRule: true,
                    supportsPallets: true,
                    supportsParcels: false
                },
            }
        ];

        getAgencyTariffs.mockReturnValue({ 1: {} });

        loadDataStaticRate.mockReturnValue({
            agencyData: {},
            agencySupplements: {},
            agencyRates: {},
            agencyPalletTypes: {}
        });

        resolveZone.mockReturnValue({ calculationMode: 'fail', name: 'ZONA X' });

        buildStaticErrorResult.mockReturnValue('ERROR');

        const result = await getStaticRates(agencies, input);

        expect(buildStaticErrorResult).toHaveBeenCalledWith({
            agency: 'DHL',
            zone: 'ZONA X',
            code: 'UNSUPPORTED_CALCULATION_MODE',
            message: 'Unsupported calculation mode: fail'
        });

        expect(result).toEqual(['ERROR']);
    });

    it('should handle calculation error, falling back to the default zone label from input', async () => {
        const agencies = [
            {
                id: { toString: () => '1' },
                name: 'DHL',
                type: 'hybrid',
                rules: {
                    hasAndaluciaRule: true,
                    supportsPallets: true,
                    supportsParcels: false
                },
            }
        ];

        getAgencyTariffs.mockReturnValue({ 1: {} });

        loadDataStaticRate.mockReturnValue({
            agencyData: {},
            agencySupplements: {},
            agencyRates: {},
            agencyPalletTypes: {}
        });

        resolveZone.mockImplementation(() => {
            throw new Error('fail');
        });

        buildStaticErrorResult.mockReturnValue('ERROR');

        const result = await getStaticRates(agencies, input);

        expect(buildStaticErrorResult).toHaveBeenCalledWith({
            agency: 'DHL',
            zone: 'NACIONAL',
            code: 'CALCULATION_ERROR',
            message: 'fail'
        });

        expect(result).toEqual(['ERROR']);
    });
});
