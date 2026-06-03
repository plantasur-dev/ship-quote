
import Agency from '../../../models/agency.model.js';

import Rate from '../../../models/rate.model.js';

import { buildVolumenBreaks } from '../../../utils/cayco.utils.js';

import { zona11, zona12 } from '../../../data/cayco.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const params = { 
  code: 'cayco', 
  collection: 'rate'
};

export async function ratesAndaluciaCayco() {
  
  const agency = await Agency.findOne({ code: params.code });

  await Rate.deleteMany({
    agencyId: agency._id,
    zoneName: { $in: ['ZONA 11', 'ZONA 12'] }
  });

  await Rate.insertMany([
    {
      agencyId: agency._id,
      type: 'pallet',
      zoneName: 'ZONA 11',
      services: {
        service: 'economy',
        priceBreaks: buildVolumenBreaks(zona11)
      }
    },
    {
      agencyId: agency._id,
      type: 'pallet',
      zoneName: 'ZONA 12',
      services: {
        service: 'economy',
        priceBreaks: buildVolumenBreaks(zona12)
      }
    }
  ]);

  loggerMsg({ 
    status: 'success',
    collection: params.collection,
    message: `${ params.code } Andalucía ${ params.collection } importadas correctamente`,
  });
}