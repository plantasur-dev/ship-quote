
import Agency from "../../lib/models/agency.model.js";

import Rate from "../../lib/models/rate.model.js";

import { buildVolumenBreaks } from '../../lib/utils/cayco.util.js';

import { zona11, zona12 } from '../../lib/storages/cayco.storage.js';

export async function seedRatesAndalucia() {
  
  const agency = await Agency.findOne({ code: "cayco" });

  await Rate.deleteMany({
    agencyId: agency._id,
    zoneName: { $in: ["ZONA 11", "ZONA 12"] }
  });

  await Rate.insertMany([
    {
      agencyId: agency._id,
      type: "pallet",
      zoneName: "ZONA 11",
      services: {
        service: 'economy',
        priceBreaks: buildVolumenBreaks(zona11)
      }
    },
    {
      agencyId: agency._id,
      type: "pallet",
      zoneName: "ZONA 12",
      services: {
        service: 'economy',
        priceBreaks: buildVolumenBreaks(zona12)
      }
    }
  ]);

  console.log("✅ Tarifas Andalucía importadas");
}