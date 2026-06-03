
import Zone from '../../../models/zone.model.js';

import { zonesRaw } from '../../../data/cayco.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const params = { 
  code: 'cayco', 
  collection: 'zone'
};

export async function zonesCayco() {

  const result = await checkExists(params);

  if (!result) return;

  const { agency, model } = result;

  await model.deleteMany({ agencyId: agency._id });

  const grouped = {};

  zonesRaw.forEach(({ province, zone }) => {
    if (!grouped[zone]) {
      grouped[zone] = [];
    }
    grouped[zone].push(province.trim());
  });

  const zonesToInsert = Object.entries(grouped)
    .map(([zoneName, provinces]) => {

      const type = ['ZONA 11', 'ZONA 12'].includes(zoneName)
        ? 'weight_volume'
        : 'weight'

      return {
        agencyId: agency._id,
        name: zoneName,
        provinces,
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
      }
    }
  );

  await model.insertMany(zonesToInsert);

  loggerMsg({ 
    status: 'success',
    collection: params.collection,
    message: `${ params.code } ${ params.collection } importadas correctamente`,
  });
}