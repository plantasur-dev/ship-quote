
import Agency from '../../../models/agency.model.js';

import Zone from '../../../models/zone.model.js';

import { zones, exceptions } from '../../../data/tecum.js';

export async function zonesTecum() {

  const agency = await Agency.findOne({ code: 'tecum' });
  
  if (!agency) {
    console.log('No existe TECUM');
    return;
  }

  const exists = await Zone.findOne({ agencyId: agency._id });
  
  if (exists) {
      console.log('Zone ya existen para TECUM, se omite');
      return;
  }

  await Zone.deleteMany({ agencyId: agency._id });

  const docs = zones.map(z => ({
    agencyId: agency._id,
    name: z.name,
    provinces: z.provinces,
    calculationMode: 'pallet',
    pricingMode: { type: 'weight'},
    postalCodeExceptions: exceptions.filter(e => e.zoneName === z.name)
  }));

  await Zone.insertMany(docs);

  console.log('✅ TECUM zonas importadas correctamente');
}