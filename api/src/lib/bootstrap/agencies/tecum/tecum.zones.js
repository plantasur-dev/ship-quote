
import Zone from '../../../models/zone.model.js';

import { zones, exceptions } from '../../../data/tecum.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const params = { 
  code: 'tecum', 
  collection: 'zone'
};

export async function zonesTecum() {

  const result = await checkExists(params);
  
  if (!result) return;

  const { agency, model } = result;
  
  await model.deleteMany({ agencyId: agency._id });

  const docs = zones.map(z => ({
    agencyId: agency._id,
    name: z.name,
    provinces: z.provinces,
    calculationMode: 'pallet',
    pricingMode: { type: 'weight'},
    postalCodeExceptions: exceptions.filter(e => e.zoneName === z.name)
  }));

  await model.insertMany(docs);

  loggerMsg({ 
    status: 'success',
    collection: params.collection,
    message: `${ params.code } ${ params.collection } importadas correctamente`,
  });
}