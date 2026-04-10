
import Agency from "../../models/agency.model.js";
import Zone from "../../models/zone.model.js";

// helper
const ex = (from, to, zoneName) => ({ from, to, zoneName });

// ---------------- DATA ----------------

const zones = [
  { name: "ZONA 21", provinces: ["ES-J"] },
  { name: "ZONA 22", provinces: ["ES-CO"] },
  { name: "ZONA 23", provinces: ["ES-AB", "ES-AL", "ES-CR", "ES-SE", "ES-MA"] },
  { name: "ZONA 24", provinces: ["ES-BA", "ES-CU", "ES-H", "ES-MU"] },
  { name: "ZONA 25", provinces: ["ES-A", "ES-CA"] },
  { name: "ZONA 16", provinces: ["ES-GR"] },
  { name: "ZONA 17", provinces: [] },

  { name: "ZONA 1", provinces: ["ES-GU", "ES-M"] },

  {
    name: "ZONA 2",
    provinces: ["ES-SO", "ES-TO"]
  },

  {
    name: "ZONA 3",
    provinces: ["ES-AV", "ES-BU", "ES-LO", "ES-SG", "ES-VA", "ES-Z"]
  },

  {
    name: "ZONA 4",
    provinces: ["ES-VI", "ES-HU", "ES-LE", "ES-NA", "ES-P", "ES-SA", "ES-TE", "ES-V", "ES-ZA"]
  },

  {
    name: "ZONA 5",
    provinces: ["ES-CS", "ES-SS", "ES-L", "ES-O", "ES-S", "ES-T", "ES-BI"]
  },

  {
    name: "ZONA 6",
    provinces: ["ES-B", "ES-CC"]
  },

  {
    name: "ZONA 7",
    provinces: ["ES-C", "ES-GI", "ES-LU", "ES-OR", "ES-PO"]
  },

  { name: "ZONA 8", provinces: [] },
  { name: "ZONA 9", provinces: ["ES-IB-ML"] },
  { name: "ZONA 10", provinces: ["ES-IB-IB", "ES-IB-MN"] },
  { name: "ZONA 11", provinces: ["ES-GC-GC", "ES-TF-TE"] },
  { name: "ZONA 12", provinces: ["ES-GC-FU", "ES-GC-LA", "ES-TF-LP", "ES-TF-LG", "ES-TF-EH"] },
  { name: "ZONA 13", provinces: ["PT-Madeira"] },
  { name: "ZONA 14", provinces: ["PT-São Miguel"] }
];

// ---------------- EXCEPCIONES ----------------

const exceptions = [
  // Guadalajara → ZONA 2
  ex("19261", "19261", "ZONA 2"),
  ex("19280", "19287", "ZONA 2"),
  ex("19300", "19392", "ZONA 2"),
  ex("19432", "19445", "ZONA 2"),
  ex("19460", "19463", "ZONA 2"),
  ex("19492", "19492", "ZONA 2"),
  ex("19495", "19495", "ZONA 2"),

  // León → ZONA 6
  ex("24100", "24114", "ZONA 6"),
  ex("24139", "24140", "ZONA 6"),
  ex("24300", "24319", "ZONA 6"),
  ex("24360", "24380", "ZONA 6"),
  ex("24384", "24390", "ZONA 6"),
  ex("24394", "24395", "ZONA 6"),
  ex("24398", "24479", "ZONA 6"),
  ex("24480", "24488", "ZONA 6"),
  ex("24490", "24498", "ZONA 6"),
  ex("24500", "24569", "ZONA 6"),
  ex("24700", "24710", "ZONA 6"),
  ex("24714", "24718", "ZONA 6"),
  ex("24720", "24750", "ZONA 6"),
  ex("24764", "24767", "ZONA 6"),
  ex("24793", "24795", "ZONA 6"),

  // Asturias → ZONA 6
  ex("33700", "33720", "ZONA 6"),
  ex("33724", "33736", "ZONA 6"),
  ex("33740", "33747", "ZONA 6"),
  ex("33749", "33750", "ZONA 6"),
  ex("33757", "33785", "ZONA 6"),
  ex("33787", "33819", "ZONA 6"),
  ex("33827", "33827", "ZONA 6"),
  ex("33830", "33839", "ZONA 6"),
  ex("33842", "33860", "ZONA 6"),
  ex("33866", "33885", "ZONA 6"),
  ex("33887", "33891", "ZONA 6"),

  // Lérida → ZONA 7
  ex("25530", "25530", "ZONA 7"),
  ex("25537", "25540", "ZONA 7"),
  ex("25548", "25551", "ZONA 7"),
  ex("25598", "25598", "ZONA 7"),
  ex("25599", "25599", "ZONA 7"),
  ex("25720", "25721", "ZONA 7"),
  ex("25724", "25724", "ZONA 7"),
  ex("25726", "25726", "ZONA 7"),
  ex("25727", "25727", "ZONA 7")
];

// ---------------- MAIN ----------------

export async function seedTecumZones() {

  const agency = await Agency.findOne({ code: "tecum" });
  if (!agency) throw new Error("No existe TECUM");

  await Zone.deleteMany({ agencyId: agency._id });

  const docs = zones.map(z => ({
    agencyId: agency._id,
    name: z.name,
    provinces: z.provinces,
    calculationMode: "pallet",
    postalCodeExceptions: exceptions.filter(e => e.zoneName === z.name)
  }));

  await Zone.insertMany(docs);

  console.log("✅ TECUM zonas importadas correctamente");
}