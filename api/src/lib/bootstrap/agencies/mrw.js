
import Rate from '../../models/rate.model.js';
import Zone from '../../models/zone.model.js';

import { 
    mrwRates, 
    mrwZones
} from '../../data/mrw.js';

import { checkExists, loggerMsg } from '../../utils/logger.utils.js';

const paramsRate = { 
    code: 'mrw', 
    collection: 'rate'
};

const paramsZone = { 
    code: 'mrw', 
    collection: 'zone'
};

export async function rateMrw() {

    const result = await checkExists(paramsRate);

    if (!result) return;

    const { agency, model } = result;
    
    await model.deleteMany({ agencyId: agency.id, type: 'parcel' });

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

    await model.insertMany(inserts);

    loggerMsg({ 
        status: 'success',
        collection: paramsRate.collection,
        message: `${ paramsRate.code } ${ paramsRate.collection } importadas correctamente`,
    });
};

export async function zoneMrw() {

    const result = await checkExists(paramsZone);

    if (!result) return;

    const { agency, model } = result;

    await model.deleteMany({ agencyId: agency.id });

    const inserts = [];

    for (const [name, data] of Object.entries(mrwZones)) {
        inserts.push({
            agencyId: agency.id,
            ...data
        });
    }

    await model.insertMany(inserts);

    loggerMsg({ 
        status: 'success',
        collection: paramsZone.collection,
        message: `${ paramsZone.code } ${ paramsZone.collection } importadas correctamente`,
    });
};