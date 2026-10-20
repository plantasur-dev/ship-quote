const mocks = vi.hoisted(() => ({
    checkExists: vi.fn(),
    findPalletTypes: vi.fn(),
    loggerMsg: vi.fn(),
    zonesBootstrap: vi.fn()
}));

vi.mock('../../../../src/lib/models/palletType.model.js', () => ({
    default: { find: mocks.findPalletTypes }
}));

vi.mock('../../../../src/lib/utils/bootstrap.utils.js', () => ({
    zonesBootstrap: mocks.zonesBootstrap
}));

vi.mock('../../../../src/lib/utils/logger.utils.js', () => ({
    checkExists: mocks.checkExists,
    loggerMsg: mocks.loggerMsg
}));

import initAgencyData from '../../../../src/lib/bootstrap/agencies/agency-data.initializer.js';

describe('initAgencyData', () => {
    const agency = { _id: 'agency-id' };
    const zoneModel = { name: 'zone-model' };
    const zoneRuleModel = { name: 'zone-rule-model' };
    const palletTypeModel = { insertMany: vi.fn() };
    const rateModel = { insertMany: vi.fn() };

    beforeEach(() => {
        vi.clearAllMocks();
        mocks.checkExists.mockImplementation(async ({ collection }) => {
            const results = {
                zone: { agency, model: zoneModel },
                zoneRule: { agency, model: zoneRuleModel },
                palletType: { agency, model: palletTypeModel },
                rate: { agency, model: rateModel }
            };
            return results[collection];
        });
        mocks.findPalletTypes.mockResolvedValue([{
            _id: 'pallet-id',
            name: 'EURO',
            constraints: {
                maxWeight: 900,
                maxLength: 120,
                maxWidth: 80,
                maxHeight: 220
            }
        }]);
    });

    it('initializes zones, pallet types, and rates through the shared loaders', async () => {
        await initAgencyData({
            schemaVersion: 1,
            code: 'example',
            defaults: {
                zone: { calculationMode: 'pallet' },
                rate: { type: 'pallet' },
                service: { service: 'economy' }
            },
            zones: [{ name: 'NATIONAL', provinces: ['ES-M'] }],
            zoneRules: {},
            palletTypes: [{
                name: 'EURO',
                maxWeight: 900,
                maxLength: 120,
                maxWidth: 80,
                maxHeight: 220
            }],
            rates: [{
                zoneName: 'NATIONAL',
                palletTypeIndex: 0,
                services: [{ priceBreaks: [{ min: 1, max: 1, price: 10 }] }]
            }]
        });

        expect(mocks.zonesBootstrap).toHaveBeenCalledWith(expect.objectContaining({
            zoneModel,
            zoneRuleModel,
            zones: [{
                name: 'NATIONAL',
                provinces: ['ES-M'],
                calculationMode: 'pallet'
            }],
            rules: {}
        }));
        expect(palletTypeModel.insertMany).toHaveBeenCalledWith([{
            agencyId: 'agency-id',
            name: 'EURO',
            constraints: {
                maxWeight: 900,
                maxLength: 120,
                maxWidth: 80,
                maxHeight: 220
            }
        }]);
        expect(rateModel.insertMany).toHaveBeenCalledWith([{
            type: 'pallet',
            zoneName: 'NATIONAL',
            palletTypeId: 'pallet-id',
            services: [{
                service: 'economy',
                priceBreaks: [{ min: 1, max: 1, price: 10 }]
            }],
            agencyId: 'agency-id'
        }]);
    });

    it('does not create pallet types when the package does not define them', async () => {
        await initAgencyData({
            schemaVersion: 1,
            code: 'parcel-carrier',
            defaults: { zone: {}, rate: {}, service: {} },
            zones: [],
            zoneRules: {},
            rates: []
        });

        expect(mocks.checkExists).not.toHaveBeenCalledWith(
            expect.objectContaining({ collection: 'palletType' })
        );
        expect(palletTypeModel.insertMany).not.toHaveBeenCalled();
        expect(rateModel.insertMany).not.toHaveBeenCalled();
    });
});
