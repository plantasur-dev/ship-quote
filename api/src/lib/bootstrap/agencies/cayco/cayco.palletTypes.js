
import Agency from "../../../models/agency.model.js";

import PalletType from "../../../models/palletType.model.js";

import { palletTypesRaw } from '../../../data/cayco.js';

export async function palletTypesCayco() {

  const agency = await Agency.findOne({ code: "cayco" });
  
  if (!agency) {
    console.log('Agency Cayco not found');
    return;
  }

  const exists = await PalletType.findOne({ agencyId: agency._id });
        
  if (exists) {
    console.log('PalletType ya existen para Cayco, se omite');
    return;
  }

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

  console.log("✅ Cayco PalletTypes importados");
}