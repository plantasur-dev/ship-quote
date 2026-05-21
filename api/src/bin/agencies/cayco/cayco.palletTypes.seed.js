
import Agency from "../../../lib/models/agency.model.js";

import PalletType from "../../../lib/models/palletType.model.js";

import { palletTypesRaw } from '../../../lib/data/cayco.js';

export async function seedPalletTypesCayco() {

  const agency = await Agency.findOne({ code: "cayco" });
  if (!agency) throw new Error("Cayco no existe");

  await PalletType.deleteMany({ agencyId: agency._id });

  const docs = palletTypesRaw.map(p => ({
      agencyId: agency._id,
      name: p.name,
      constraints: {
        maxWeight: p.maxWeight,
        maxLength: p.maxLength,
        maxWidth: p.maxWidth,
        maxHeight: p.maxHeight
      }
    })
  );

  await PalletType.insertMany(docs);

  console.log("✅ PalletTypes importados");
}