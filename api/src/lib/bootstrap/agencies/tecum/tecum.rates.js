
import Agency from '../../../models/agency.model.js';

import Rate from '../../../models/rate.model.js';

import PalletType from '../../../models/palletType.model.js';

import { buildPriceBreaks } from '../../../utils/agency/tecum.utils.js';

import { fixed } from '../../../utils/bootstrap.utils.js';

import { 
  tecumPalletRates, 
  tecumExtraLightRates, 
  tecumEuroPalletRates, 
  tecumFullRates,
  palletMap 
} from '../../../data/tecum.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const tablesConfig = [
  { table: tecumExtraLightRates, palletName: 'EXTRA LIGHT PALLET' },
  { table: tecumEuroPalletRates, palletName: 'EURO PALLET' },
  { table: tecumFullRates, palletName: 'FULL PALLET' }
];

const params = { 
  code: 'tecum', 
  collection: 'rate'
}

// Pallets Quantity
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
          priceBreaks: buildPriceBreaks(servicesData.premium),
          fallbackToLastPrice: true
        });
      }

      // ECONOMY
      if (servicesData.economy) {
        services.push({
          service: 'economy',
          priceBreaks: buildPriceBreaks(servicesData.economy),
          fallbackToLastPrice: true
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

// Pallets Simple
export async function ratesTecum() {

  const result = await checkExists(params);

  if (!result) return;

  const { agency, model } = result;

  const palletTypes = await PalletType.find({ agencyId: agency._id });

  await model.deleteMany({ agencyId: agency._id });

  const inserts = [];

  for (const [zone, prices] of Object.entries(tecumPalletRates)) {
    for (let i = 0; i < palletMap.length; i++) {
      const palletName = palletMap[i];
      const matchingPallets = palletTypes.filter(p => p.name === palletName);

      if (!matchingPallets.length) {
        loggerMsg({
          status: 'warning',
          collection: params.collection,
          message: `Pallet no encontrado: ${ palletName }`,
        });
        continue;
      }

      for (const pallet of matchingPallets) {
        inserts.push({
          agencyId: agency._id,
          type: 'pallet',
          zoneName: zone,
          palletTypeId: pallet._id,
          services: [
            {
              service: 'premium',
              priceBreaks: fixed(prices[i]),
              fallbackToLastPrice: true
            }, 
            {
              service: 'economy',
              priceBreaks: fixed(prices[i + 4]),
              fallbackToLastPrice: true
            }
          ]
        });
      }
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