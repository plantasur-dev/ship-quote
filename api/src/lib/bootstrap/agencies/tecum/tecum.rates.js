
import Agency from '../../../models/agency.model.js';

import Rate from '../../../models/rate.model.js';

import PalletType from '../../../models/palletType.model.js';

import { 
  buildPriceBreaks, 
  fixed 
} from '../../../utils/tecum.utils.js';

import { 
  palletSimple, 
  ExtraLight, 
  EuroPallet, 
  Full,
  palletMap 
} from '../../../data/tecum.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const tablesConfig = [
  { table: ExtraLight, palletName: 'EXTRA LIGHT PALLET' },
  { table: EuroPallet, palletName: 'EURO PALLET' },
  { table: Full, palletName: 'FULL PALLET' }
];

const params = { 
  code: 'tecum', 
  collection: 'rate'
}

async function ratesByQuantityTecum() {

  const agency = await Agency.findOne({ code: params.code });

  const palletTypes = await PalletType.find({ agencyId: agency._id });

  const inserts = [];

  for (const tableConfig of tablesConfig) {

    const { table, palletName } = tableConfig;

    const pallet = palletTypes.find(p => p.name === palletName);

    if (!pallet) {
      loggerMsg({ 
        status: 'warning',
        collection: params.collection,
        message: `Pallet no encontrado: ${ palletName }`,
      });
      continue;
    }

    for (const [zoneName, servicesData] of Object.entries(table)) {

      const services = [];

      // PREMIUM
      if (servicesData.premium) {
        services.push({
          service: 'premium',
          priceBreaks: buildPriceBreaks(servicesData.premium)
        });
      }

      // ECONOMY
      if (servicesData.economy) {
        services.push({
          service: 'economy',
          priceBreaks: buildPriceBreaks(servicesData.economy)
        });
      }

      inserts.push({
        agencyId: agency._id,
        type: 'pallet',
        zoneName,
        palletTypeId: pallet._id,
        calculationType: 'quantity',
        services
      });
    }
  }

  await Rate.insertMany(inserts);

  loggerMsg({ 
    status: 'success',
    collection: params.collection,
    message: `${ params.code } ${ params.collection } por cantidad importadas correctamente`,
  });
};

export async function ratesTecum() {

  const result = await checkExists(params);

  if (!result) return;

  const { agency, model } = result;

  const palletTypes = await PalletType.find({ agencyId: agency._id });

  await model.deleteMany({ agencyId: agency._id });

  const inserts = [];

  for (const [zone, prices] of Object.entries(palletSimple)) {

    for (let i = 0; i < palletMap.length; i++) {

      const palletName = palletMap[i];
      const pallet = palletTypes.find(p => p.name === palletName);

      if (!pallet) {
        logger.warn({
          event: 'rate:bootstrap:error',
          service: 'ship-quote-api',
          message: `Pallet no encontrado: ${ palletName }`,
          component: 'database'
        });
        continue;
      }

      inserts.push({
        agencyId: agency._id,
        type: 'pallet',
        zoneName: zone,
        palletTypeId: pallet._id,
        services: [
          {
            service: 'premium',
            priceBreaks: fixed(prices[i]),
          }, 
          {
            service: 'economy',
            priceBreaks: fixed(prices[i + 4]),
          }
        ]
      });
    }
  }

  await model.insertMany(inserts);

  loggerMsg({ 
    status: 'success',
    collection: params.collection,
    message: `${ params.code } ${ params.collection } importadas correctamente`,
  });

  await ratesByQuantityTecum();
}