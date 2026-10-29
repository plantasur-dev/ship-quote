
import Agency from '../../src/lib/models/agency.model.js';
import PalletType from '../../src/lib/models/palletType.model.js';
import Rate from '../../src/lib/models/rate.model.js';
import Zone from '../../src/lib/models/zone.model.js';
import ZoneRules from '../../src/lib/models/zone.rules.model.js';
import initAgenciesData from '../../src/lib/bootstrap/agencies/agencies.seed.js';

describe('agency package bootstrap', () => {
    it('persists all canonical packages without changing existing agency settings or duplicating data', async () => {
        const existingCayco = await Agency.create({
            name: 'Cayco',
            type: 'static',
            active: false,
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: 'percentage',
                    value: 77
                }
            }
        });

        await initAgenciesData();

        const kuehneNagel = await Agency.findOne({ code: 'kuehne_nagel' });
        const kuehneRate = await Rate.findOne({
            agencyId: kuehneNagel._id,
            zoneName: 'Austria-ZONA-1',
            palletTypeId: null
        }).lean();
        expect(kuehneRate.services[0].priceBreaks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    min: 1001,
                    max: 2000,
                    pricing: {
                        type: 'per_weight_unit',
                        unitKg: 100,
                        unit: '€/100kg'
                    }
                })
            ])
        );

        expect(await Agency.countDocuments()).toBe(8);
        expect(await Zone.countDocuments()).toBe(596);
        expect(await PalletType.countDocuments()).toBe(15);
        expect(await Rate.countDocuments()).toBe(776);

        const rules = await ZoneRules.find().lean();
        expect(rules.flatMap(({ postalCodeRanges }) => postalCodeRanges)).toHaveLength(572);
        expect(rules.some(rule =>
            rule.postalCodeRanges.some(({ kind }) => kind === 'prefix')
        )).toBe(true);

        const persistedCayco = await Agency.findById(existingCayco._id).lean();
        expect(persistedCayco).toMatchObject({
            active: false,
            supplements: { fuelSurcharge: { enabled: true, value: 77 } }
        });

        const tecum = await Agency.findOne({ code: 'tecum' });
        const duplicatePallets = await PalletType.find({
            agencyId: tecum._id,
            name: 'MINI QUARTER PALLET'
        }).lean();
        const duplicateRates = await Rate.find({
            agencyId: tecum._id,
            zoneName: 'ZONA 21',
            palletTypeId: { $in: duplicatePallets.map(({ _id }) => _id) }
        }).lean();

        expect(duplicatePallets).toHaveLength(2);
        expect(duplicateRates).toHaveLength(2);
        const getPricedServices = ({ services }) => services.map(({
            service,
            fallbackToLastPrice,
            priceBreaks
        }) => ({
            service,
            fallbackToLastPrice,
            priceBreaks: priceBreaks.map(({ min, max, price }) => ({ min, max, price }))
        }));
        expect(getPricedServices(duplicateRates[0])).toEqual(
            getPricedServices(duplicateRates[1])
        );

        await initAgenciesData();

        expect(await Agency.countDocuments()).toBe(8);
        expect(await Zone.countDocuments()).toBe(596);
        expect(await PalletType.countDocuments()).toBe(15);
        expect(await Rate.countDocuments()).toBe(776);
    });
});
