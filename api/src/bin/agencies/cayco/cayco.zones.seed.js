
import Agency from '../../../lib/models/agency.model.js';

import Zone from '../../../lib/models/zone.model.js';

import { zonesRaw } from '../../../lib/data/cayco.js';

export async function seedZonesCayco() {

  const agency = await Agency.findOne({ code: 'cayco' });

  if (!agency) {
    throw new Error('Agency Cayco not found');
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
        pricingMode: {
          type,
          tonnagePricingRule: {
            enabled: type === 'weight_volume'
          }
        }
      }
    }
  );

  await Zone.insertMany(zonesToInsert);

  console.log('✅ Zonas de Cayco importadas correctamente');
}