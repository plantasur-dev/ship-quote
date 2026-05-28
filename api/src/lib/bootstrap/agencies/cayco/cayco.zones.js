
import Agency from '../../../models/agency.model.js';

import Zone from '../../../models/zone.model.js';

import { zonesRaw } from '../../../data/cayco.js';

export async function zonesCayco() {

  const exists = await Zone.findOne();
    
  if (exists) {
    console.log('Zone ya existen para Cayco, se omite');
    return;
  }

  const agency = await Agency.findOne({ code: 'cayco' });

  if (!agency) {
    console.log('Agency Cayco not found');
    return;
  }

  await Zone.deleteMany({ agencyId: agency._id });

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

  await Zone.insertMany(zonesToInsert);

  console.log('✅ Zonas de Cayco importadas correctamente');
}