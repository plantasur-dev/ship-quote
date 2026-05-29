
import Agency from '../../models/agency.model.js';

import Rate from '../../models/rate.model.js';

import Zone from '../../models/zone.model.js';

import { 
    mrwRates, 
    mrwZones
} from '../../data/mrw.js';

export async function rateMrw() {

    const agency = await Agency.findOne({ code: 'mrw' });
    
    if (!agency) {
        console.log('No existe Mrw');
        return;
    }

    const exists = await Rate.findOne({ agencyId: agency.id });

    if (exists) {
        console.log('Rate ya existen para MRW, se omite');
        return;
    }
    
    await Rate.deleteMany({ agencyId: agency.id, type: 'parcel' });

    const inserts = [];

    for (const [zoneName, data] of Object.entries(mrwRates)) {

        inserts.push({
            agencyId: agency.id,
            type: 'parcel',
            zoneName,
            palletTypeId: null,
            calculationType: 'unit',
            services: [{
                service: 'basic',
                priceBreaks: data.priceBreaks,
                surcharges: data.surcharges,
                limits: data.limits
            }]
        });
    }

    await Rate.insertMany(inserts);

    console.log('✅ Mrw rates insertados');
};

export async function zoneMrw() {

    const agency = await Agency.findOne({ code: 'mrw' });

    if (!agency) {
        console.log('No existe Mrw');
        return;
    }

    const exists = await Zone.findOne({ agencyId: agency.id });

    if (exists) {
        console.log('Zone ya existen para MRW, se omite');
        return;
    }

    await Zone.deleteMany({ agencyId: agency.id });

    const inserts = [];

    for (const [name, data] of Object.entries(mrwZones)) {
        inserts.push({
            agencyId: agency.id,
            ...data
        });
    }

    await Zone.insertMany(inserts);

    console.log('✅ Mrw zones insertados');
};