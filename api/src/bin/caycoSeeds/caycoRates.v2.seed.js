
import Agency from "../../lib/models/agency.model.js";

import Rate from "../../lib/models/rate.model.js";

import PalletType from "../../lib/models/palletType.model.js";

import { fixedPrice, buildBreaks, buildWeightBreaks } from '../../lib/utils/cayco.util.js';

import { basicRates, basicNames, completoRates, superRates } from '../../lib/storages/cayco.storage.js';

export async function seedRates() {
  
  const agency = await Agency.findOne({ code: "cayco" });
  const palletTypes = await PalletType.find({ agencyId: agency._id });

  await Rate.deleteMany({ agencyId: agency._id });

  const inserts = [];

  for (const [zone, prices] of Object.entries(basicRates)) {
    for (let i = 0; i < basicNames.length; i++) {
      const pallet = palletTypes.find(p => p.name === basicNames[i]);
      if (!pallet) continue;

      inserts.push({
        agencyId: agency._id,
        type: "pallet",
        zoneName: zone,
        palletTypeId: pallet._id,
        services: {
          service: 'economy',
          priceBreaks: fixedPrice(prices[i])
        }
      });
    }
  }

  const completoType = palletTypes.find(p => p.name === "COMPLETO");

  for (const [zone, prices] of Object.entries(completoRates)) {
    inserts.push({
      agencyId: agency._id,
      type: "pallet",
      zoneName: zone,
      palletTypeId: completoType._id,
      calculationType: 'quantity',
      services: {
        service: 'economy',
        priceBreaks: buildBreaks(prices)
      }
    });
  }

  const superType = palletTypes.find(p => p.name === "SUPER");

  for (const [zone, prices] of Object.entries(superRates)) {
    inserts.push({
      agencyId: agency._id,
      type: "pallet",
      zoneName: zone,
      palletTypeId: superType._id,
      calculationType: 'quantity',
      services: {
        service: 'economy',
        priceBreaks: buildBreaks(prices)
      }
    });
  }

  await Rate.insertMany(inserts);

  console.log("✅ Seed completo Cayco listo");
}