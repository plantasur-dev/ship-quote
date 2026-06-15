
import { zones, exceptions } from '../../../data/tecum.js';

import { zonesBootstrap } from '../../../utils/bootstrap.utils.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const paramsZone = { 
  code: 'tecum', 
  collection: 'zone',
};

const paramsZoneRule = { 
  code: 'tecum', 
  collection: 'zoneRule',
};

export async function zonesTecum() {

  const result1 = await checkExists(paramsZone);

  const result2 = await checkExists(paramsZoneRule);
  
  if (!result1 && !result2) return;

  await zonesBootstrap({ 
    zoneModel: result1.model, 
    agency: result1.agency, 
    zones,
    zoneRuleModel: result2.model,
    rules: {
      calculationMode: 'pallet',
      pricingMode: { type: 'weight' },
      exceptions
    } 
  });

  loggerMsg({ 
    status: 'success',
    collection: paramsZone.collection,
    message: `${ paramsZone.code } ${ paramsZone.collection } importadas correctamente`,
  });
}