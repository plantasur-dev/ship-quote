
import Agency from '../../../models/agency.model.js';

import Rate from '../../../models/rate.model.js';

import PalletType from '../../../models/palletType.model.js';

import { 
  buildPriceBreaks, 
  fixed, 
  palletMap 
} from '../../../utils/tecum.utils.js';

import { 
  palletSimple, 
  ExtraLight, 
  EuroPallet, 
  Full 
} from '../../../data/tecum.js';

const ratesByQuantityTecum = async (agencyCode) => {

  const tablesConfig =  [
    { table: ExtraLight, palletName: 'EXTRA LIGHT PALLET' },
    { table: EuroPallet, palletName: 'EURO PALLET' },
    { table: Full, palletName: 'FULL PALLET' }
  ];

  const agency = await Agency.findOne({ code: agencyCode });
  if (!agency) throw new Error(`No existe ${agencyCode}`);

  const palletTypes = await PalletType.find({ agencyId: agency._id });

  const inserts = [];

  for (const tableConfig of tablesConfig) {

    const { table, palletName } = tableConfig;

    const pallet = palletTypes.find(p => p.name === palletName);

    if (!pallet) {
      console.warn(`⚠️ Pallet no encontrado: ${ palletName }`);
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

  console.log('✅ Rates Tecum por cantidad insertados');
};

export async function ratesTecum() {

  const agency = await Agency.findOne({ code: 'tecum' });
    
  if (!agency) {
    console.log('No existe TECUM');
    return;
  }

  const exists = await Rate.findOne({ agencyId: agency._id });

  if (exists) {
      console.log('Rate ya existen para TECUM, se omite');
      return;
  }

  const palletTypes = await PalletType.find({ agencyId: agency._id });

  await Rate.deleteMany({ agencyId: agency._id });

  const inserts = [];

  for (const [zone, prices] of Object.entries(palletSimple)) {

    for (let i = 0; i < palletMap.length; i++) {

      const palletName = palletMap[i];
      const pallet = palletTypes.find(p => p.name === palletName);

      if (!pallet) {
        console.warn(`⚠️ Pallet no encontrado: ${palletName}`);
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

  await Rate.insertMany(inserts);

  console.log('✅ Tarifas TECUM importadas');

  await ratesByQuantityTecum('tecum');
}