
import Agency from "../../models/agency.model.js";
import PalletType from "../../models/palletType.model.js";

const palletTypesRaw = [
  { name: "MINI", maxWeight: 150,  maxLength: 120, maxWidth: 100, maxHeight: 60 },
  { name: "CUARTO", maxWeight: 300,  maxLength: 120, maxWidth: 100, maxHeight: 80 },
  { name: "PLUMA", maxWeight: 300,  maxLength: 120, maxWidth: 80, maxHeight: 220 },
  { name: "MEDIO", maxWeight: 450,  maxLength: 120, maxWidth: 100, maxHeight: 180 },
  { name: "LIGERO", maxWeight: 600,  maxLength: 120, maxWidth: 100, maxHeight: 220 },
  { name: "COMPLETO", maxWeight: 800,  maxLength: 120, maxWidth: 100, maxHeight: 180 },
  { name: "SUPER", maxWeight: 1200,  maxLength: 120, maxWidth: 100, maxHeight: 220 }
];

export async function seedPalletTypes() {

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
  }));

  await PalletType.insertMany(docs);

  console.log("✅ PalletTypes importados");
}