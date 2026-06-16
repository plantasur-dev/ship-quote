
import PalletType from '../../../models/palletType.model.js';

import { ratesAndaluciaCayco } from './cayco.ratesAndalucia.js';

import { 
  fixedPrice, 
  buildBreaks, 
  buildWeightBreaks 
} from '../../../utils/cayco.utils.js';

import { 
  basicRates, 
  basicNames, 
  completoRates, 
  superRates 
} from '../../../data/cayco.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const params = { 
  code: 'cayco', 
  collection: 'rate'
};

export async function ratesCayco() {

  const result = await checkExists(params);

  if (!result) return;

  const { agency, model } = result;
  
  await model.deleteMany(agency.agencyId);

  const palletTypes = await PalletType.find(agency.agencyId);

  const inserts = [];

  for (const [zone, prices] of Object.entries(basicRates)) {
    for (let i = 0; i < basicNames.length; i++) {
      const pallet = palletTypes.find(p => p.name === basicNames[i]);
      if (!pallet) continue;

      inserts.push({
        agencyId: agency._id,
        type: 'pallet',
        zoneName: zone,
        palletTypeId: pallet._id,
        services: {
          service: 'economy',
          priceBreaks: fixedPrice(prices[i])
        }
      });
    }
  }

  const completoType = palletTypes.find(p => p.name === 'COMPLETO');

  for (const [zone, prices] of Object.entries(completoRates)) {
    inserts.push({
      agencyId: agency._id,
      type: 'pallet',
      zoneName: zone,
      palletTypeId: completoType._id,
      calculationType: 'quantity',
      services: {
        service: 'economy',
        priceBreaks: buildBreaks(prices)
      }
    });
  }

  const superType = palletTypes.find(p => p.name === 'SUPER');

  for (const [zone, prices] of Object.entries(superRates)) {
    inserts.push({
      agencyId: agency._id,
      type: 'pallet',
      zoneName: zone,
      palletTypeId: superType._id,
      calculationType: 'quantity',
      services: {
        service: 'economy',
        priceBreaks: buildBreaks(prices)
      }
    });
  }

  await model.insertMany(inserts);

  loggerMsg({ 
    status: 'success',
    collection: params.collection,
    message: `${ params.code } ${ params.collection } importadas correctamente`,
  });

  await ratesAndaluciaCayco();
}