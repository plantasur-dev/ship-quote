
import {
    getStaticRates
} from '../../../../src/api/services/rates/index.js';

import { getAgencyTariffs } from '../../../../src/api/services/cache.service.js';
import { resolveZone } from '../../../../src/lib/utils/rate.utils.js';

import { calculatePallet } from '../../../../src/api/services/rates/providers/static/pallet.rate.calculator.js';
import { calculateParcel } from '../../../../src/api/services/rates/providers/static/parcel.rate.calculator.js';

import { buildStaticErrorResult } from '../../../../src/api/services/rates/domains/build.rate.result.js';

vi.mock('../../../../src/api/services/cache.service.js', () => ({
    getAgencyTariffs: vi.fn()
}));

vi.mock('../../../../src/lib/utils/rate.utils.js', () => ({
    resolveZone: vi.fn()
}));

vi.mock('../../../../src/api/services/rates/providers/static/pallet.rate.calculator.js', () => ({
    calculatePallet: vi.fn()
}));

vi.mock('../../../../src/api/services/rates/providers/static/parcel.rate.calculator.js', () => ({
    calculateParcel: vi.fn()
}));

vi.mock('../../../../src/api/services/rates/domains/build.rate.result.js', () => ({
    buildStaticErrorResult: vi.fn()
}));

const input = {
    destinationPostalCode: '28001',
    province: 'ES-M',
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


it('should calculate pallet rates when zone mode is pallet', async () => {
    const agencies = [
        { id: { toString: () => '1' }, name: 'DHL' }
    ];

    getAgencyTariffs.mockReturnValue({
        1: {
            zones: [],
            zoneRules: [],
            ratesByKey: [],
            sortedPalletTypes: []
        }
    });

    resolveZone.mockReturnValue({
        calculationMode: 'pallet'
    });

    calculatePallet.mockReturnValue(palletResult);

    const result = await getStaticRates(agencies, input);

    expect(calculatePallet).toHaveBeenCalled();
    expect(result).toEqual([palletResult]);
});

it('should calculate parcel rates when zone mode is not pallet', async () => {
    const agencies = [
        { id: { toString: () => '1' }, name: 'UPS' }
    ];

    getAgencyTariffs.mockReturnValue({
        1: {
            ratesByKey: []
        }
    });

    resolveZone.mockReturnValue({
        calculationMode: 'parcel'
    });

    calculateParcel.mockReturnValue(parcelResult);

    const result = await getStaticRates(agencies, input);

    expect(calculateParcel).toHaveBeenCalled();
    expect(result).toEqual([parcelResult]);
});

it('should return zone error when zone is not found', async () => {
    const agencies = [
        { id: { toString: () => '1' }, name: 'DHL' }
    ];

    getAgencyTariffs.mockReturnValue({
        1: {}
    });

    resolveZone.mockReturnValue(null);

    buildStaticErrorResult.mockReturnValue('ZONE_ERROR');

    const result = await getStaticRates(agencies, input);

    expect(buildStaticErrorResult).toHaveBeenCalledWith(
        expect.objectContaining({
            code: 'ZONE_NOT_FOUND'
        })
    );

    expect(result).toEqual(['ZONE_ERROR']);
});

it('should handle calculation error', async () => {
    const agencies = [
        { id: { toString: () => '1' }, name: 'DHL' }
    ];

    getAgencyTariffs.mockReturnValue({
        1: {}
    });

    resolveZone.mockImplementation(() => {
        throw new Error('fail');
    });

    buildStaticErrorResult.mockReturnValue('ERROR');

    const result = await getStaticRates(agencies, input);

    expect(buildStaticErrorResult).toHaveBeenCalledWith(
        expect.objectContaining({
            code: 'CALCULATION_ERROR'
        })
    );

    expect(result).toEqual(['ERROR']);
});