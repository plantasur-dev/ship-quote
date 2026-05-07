
import Agency from "../../lib/models/agency.model.js";

import Zone from "../../lib/models/zone.model.js";

import { zones, exceptions } from '../../lib/storages/tecum.storage.js';

export async function seedTecumZones() {

  const agency = await Agency.findOne({ code: "tecum" });
  if (!agency) throw new Error("No existe TECUM");

  await Zone.deleteMany({ agencyId: agency._id });

  const docs = zones.map(z => ({
    agencyId: agency._id,
    name: z.name,
    provinces: z.provinces,
    calculationMode: "pallet",
    pricingMode: "weight",
    postalCodeExceptions: exceptions.filter(e => e.zoneName === z.name)
  }));

  await Zone.insertMany(docs);

  console.log("✅ TECUM zonas importadas correctamente");
}