
import Agency from '../../models/agency.model.js';

import Rate from '../../models/rate.model.js';
import Zone from '../../models/zone.model.js';

import { 
    correosRates, 
    correosZones
} from '../../data/cexp.js';

export async function ratesCorreos() {

    const agency = await Agency.findOne({ code: 'correosexpress' });
   
    if (!agency) {
        console.log('No existe Correos Express');
        return;
    }

    const exists = await Rate.findOne({ agencyId: agency.id });

    if (exists) {
        console.log('Rate ya existen para CEXP, se omite');
        return;
    }

    await Rate.deleteMany({ agencyId: agency.id, type: 'parcel' });

    const inserts = [];

    for (const [zoneName, data] of Object.entries(correosRates)) {

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

    console.log('✅ Correos Express rates insertados');
};

export async function zonesCorreos() {

    const agency = await Agency.findOne({ code: 'correosexpress' });
    
    if (!agency) {
        console.log('No existe Correos Express');
        return;
    }

    const exists = await Zone.findOne({ agencyId: agency.id });

    if (exists) {
        console.log('Zone ya existen para CEXP, se omite');
        return;
    }

    await Zone.deleteMany({ agencyId: agency.id });

    const inserts = [];

    for (const [name, data] of Object.entries(correosZones)) {
        inserts.push({
            agencyId: agency.id,
            ...data
        });
    }

    await Zone.insertMany(inserts);

    console.log('✅ Correos Express zones insertados');
};