
import Rate from '../../models/rate.model.js';

import { 
    mrwRates, 
    mrwZones
} from '../../data/mrw.js';

import { zonesBootstrap } from '../../utils/bootstrap.utils.js';

import { checkExists, loggerMsg } from '../../utils/logger.utils.js';

const paramsRate = { 
    code: 'mrw', 
    collection: 'rate'
};

const paramsZone = { 
    code: 'mrw', 
    collection: 'zone'
};

const paramsZoneRule = { 
    code: 'mrw', 
    collection: 'zoneRule'
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

    const result1 = await checkExists(paramsZone);

    const result2 = await checkExists(paramsZoneRule);

    if (!result1 || !result2) return;

    await zonesBootstrap({ 
        zoneModel: result1.model, 
        agency: result1.agency, 
        zones: mrwZones.zones,
        zoneRuleModel: result2.model,
        rules: {
          calculationMode: mrwZones.calculationMode,
          pricingMode: mrwZones.pricingMode,
          exceptions: mrwZones.postalCodeExceptions
        } 
    });

    loggerMsg({ 
        status: 'success',
        collection: paramsZone.collection,
        message: `${ paramsZone.code } ${ paramsZone.collection } importadas correctamente`,
    });
};