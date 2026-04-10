
import Agency from "../../models/agency.model.js";
import PalletType from "../../models/palletType.model.js";

const palletTypesRaw = [
  { name: "FULL PALLET", maxWeight: 1200,  maxLength: 100, maxWidth: 120, maxHeight: 220 },
  { name: "EURO PALLET", maxWeight: 900,  maxLength: 80, maxWidth: 120, maxHeight: 220 },
  { name: "HALF PALLET", maxWeight: 600,  maxLength: 100, maxWidth: 120, maxHeight: 160 },
  { name: "EXTRA LIGHT PALLET", maxWeight: 450,  maxLength: 100, maxWidth: 120, maxHeight: 220 },
  { name: "SUPER EURO LIGHT PALLET", maxWeight: 300,  maxLength: 80, maxWidth: 120, maxHeight: 220 },
  { name: "QUARTER PALLET", maxWeight: 300,  maxLength: 120, maxWidth: 120, maxHeight: 110 },
  { name: "MINI QUARTER PALLET", maxWeight: 150,  maxLength: 100, maxWidth: 120, maxHeight: 80 },
  { name: "MINI QUARTER PALLET", maxWeight: 150,  maxLength: 80, maxWidth: 60, maxHeight: 120 }
];

export async function seedTecumPalletTypes() {

  const agency = await Agency.findOne({ code: "tecum" });
  if (!agency) throw new Error("Tecum no existe");

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