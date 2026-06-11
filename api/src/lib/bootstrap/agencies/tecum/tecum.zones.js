
import ZoneRules from '../../../models/zone.rules.model.js';

import { zones, exceptions } from '../../../data/tecum.js';

import { zonesBootstrap } from '../../../utils/bootstrap.utils.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const paramsZone = { 
  code: 'tecum', 
  collection: 'zone',
};

export async function zonesTecum() {

  const result = await checkExists(paramsZone);
  
  if (!result) return;

  const { agency, model } = result;

  await zonesBootstrap({ 
    zoneModel: model, 
    agency, 
    zones,
    zoneRuleModel: ZoneRules,
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