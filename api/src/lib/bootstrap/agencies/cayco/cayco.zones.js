
import { zones } from '../../../data/cayco.js';

import { zonesBootstrap } from '../../../utils/bootstrap.utils.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const paramsZone = { 
  code: 'cayco', 
  collection: 'zone'
};

const paramsZoneRule = { 
  code: 'cayco', 
  collection: 'zoneRule',
};

export async function zonesCayco() {

  const result1 = await checkExists(paramsZone);
  
  const result2 = await checkExists(paramsZoneRule);
  
  if (!result1 || !result2) return;

  await zonesBootstrap({
    zoneModel: result1.model, 
    agency: result1.agency, 
    zones,
    zoneRuleModel: result2.model,
    rules: {},
    zoneBuilder: (zone, agency) => {
      const type = ['ZONA 11', 'ZONA 12'].includes(zone.name)
        ? 'weight_volume'
        : 'weight';

      return {
        agencyId: agency._id,
        name: zone.name,
        provinces: zone.provinces,
        calculationMode: 'pallet',
        volumetric: {
          enabled: type === 'weight_volume'
        },
        pricingMode: {
          type,
          tonnagePricingRule: {
            enabled: type === 'weight_volume',
            threshold: 1001
          }
        }
      };
    }
  });

  loggerMsg({ 
    status: 'success',
    collection: paramsZone.collection,
    message: `${ paramsZone.code } ${ paramsZone.collection } importadas correctamente`,
  });
}