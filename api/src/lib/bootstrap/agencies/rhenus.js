
import Rate from '../../models/rate.model.js';

import { 
    rhenusRates,
    createRhenusZones
} from '../../data/rhenus.data.js';

import { zonesBootstrap } from '../../utils/bootstrap.utils.js';

import { checkExists, loggerMsg } from '../../utils/logger.utils.js';

const paramsRate = { 
    code: 'rhenus', 
    collection: 'rate'
};

const paramsZone = { 
    code: 'rhenus', 
    collection: 'zone'
};

const paramsZoneRule = { 
    code: 'rhenus', 
    collection: 'zoneRule'
};

export async function ratesRhenus() {

    const result = await checkExists(paramsRate);

    if (!result) return;

    const { agency, model } = result;
    
    await model.deleteMany({ agencyId: agency.id, type: 'pallet' });

    const inserts = [];

    for (const [zoneName, data] of Object.entries(rhenusRates)) {

        inserts.push({
            agencyId: agency.id,
            type: 'pallet',
            zoneName,
            palletTypeId: null,
            calculationType: 'unit',
            services: [{
                service: 'basic',
                priceBreaks: data.priceBreaks,
                fallbackToLastPrice: data.fallbackToLastPrice,
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

export async function zonesRhenus() {   
    const result1 = await checkExists(paramsZone);

    const result2 = await checkExists(paramsZoneRule);

    if (!result1 || !result2) return;

    const rhenusZones = await createRhenusZones();

    await zonesBootstrap({ 
        zoneModel: result1.model, 
        agency: result1.agency, 
        zones: rhenusZones.zones,
        zoneRuleModel: result2.model,
        rules: {
            calculationMode: rhenusZones.calculationMode,
            pricingMode: rhenusZones.pricingMode,
            exceptions: rhenusZones.postalCodeExceptions,
            volumetric: rhenusZones.volumetric
        } 
    });

    loggerMsg({ 
        status: 'success',
        collection: paramsZone.collection,
        message: `${ paramsZone.code } ${ paramsZone.collection } importadas correctamente`,
    });
};