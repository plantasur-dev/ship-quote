
import Agency from '../../../models/agency.model.js';

import Rate from '../../../models/rate.model.js';

import { buildVolumenBreaks } from '../../../utils/cayco.utils.js';

import { zona11, zona12 } from '../../../data/cayco.js';

export async function ratesAndaluciaCayco() {

  const exists = await Rate.findOne();
      
  if (exists) {
    console.log('Rate Andalucía ya existen para Cayco, se omite');
    return;
  }
  
  const agency = await Agency.findOne({ code: 'cayco' });

  if (!agency) {
    console.log('Agency Cayco not found');
    return;
  }

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

  console.log('✅ Tarifas Andalucía importadas');
}