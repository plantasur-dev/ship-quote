
import Agency from "../../models/agency.model.js";
import Zone from "../../models/zone.model.js";

const zonesRaw = [
  { province: "ES-M", zone: "ZONA 1" },
  { province: "ES-TO", zone: "ZONA 2" },
  { province: "ES-AV", zone: "ZONA 3" },
  { province: "ES-GU", zone: "ZONA 3" },
  { province: "ES-SG", zone: "ZONA 3" },
  { province: "ES-VA", zone: "ZONA 3" },

  { province: "ES-VI", zone: "ZONA 4" },
  { province: "ES-A", zone: "ZONA 4" },
  { province: "ES-BU", zone: "ZONA 4" },
  { province: "ES-CS", zone: "ZONA 4" },
  { province: "ES-LE", zone: "ZONA 4" },
  { province: "ES-LO", zone: "ZONA 4" },
  { province: "ES-MU", zone: "ZONA 4" },
  { province: "ES-SA", zone: "ZONA 4" },
  { province: "ES-SO", zone: "ZONA 4" },
  { province: "ES-TE", zone: "ZONA 4" },
  { province: "ES-V", zone: "ZONA 4" },
  { province: "ES-Z", zone: "ZONA 4" },
  { province: "ES-CR", zone: "ZONA 4" },

  { province: "ES-O", zone: "ZONA 5" },
  { province: "ES-S", zone: "ZONA 5" },
  { province: "ES-CU", zone: "ZONA 5" },
  { province: "ES-SS", zone: "ZONA 5" },
  { province: "ES-NA", zone: "ZONA 5" },
  { province: "ES-BI", zone: "ZONA 5" },
  { province: "ES-P", zone: "ZONA 5" },
  { province: "ES-AB", zone: "ZONA 5" },
  { province: "ES-ZA", zone: "ZONA 5" },

  { province: "ES-B", zone: "ZONA 6" },
  { province: "ES-HU", zone: "ZONA 6" },
  { province: "ES-T", zone: "ZONA 6" },

  { province: "ES-C", zone: "ZONA 7" },
  { province: "ES-GI", zone: "ZONA 7" },
  { province: "ES-LU", zone: "ZONA 7" },
  { province: "ES-OR", zone: "ZONA 7" },
  { province: "ES-PO", zone: "ZONA 7" },
  { province: "ES-CC", zone: "ZONA 7" },
  { province: "ES-BA", zone: "ZONA 7" },
  { province: "ES-L", zone: "ZONA 7" },

  { province: "ES-AL", zone: "ZONA 11" },
  { province: "ES-J", zone: "ZONA 11" },
  { province: "ES-MA", zone: "ZONA 11" },

  { province: "ES-SE", zone: "ZONA 12" },
  { province: "ES-CO", zone: "ZONA 12" }
];

export async function seedZones() {

  const agency = await Agency.findOne({ code: "cayco" });

  if (!agency) {
    throw new Error("Agency Cayco not found");
  }

  await Zone.deleteMany({ agencyId: agency._id });

  const grouped = {};

  zonesRaw.forEach(({ province, zone }) => {
    if (!grouped[zone]) {
      grouped[zone] = [];
    }
    grouped[zone].push(province.trim());
  });

  const zonesToInsert = Object.entries(grouped).map(([zoneName, provinces]) => ({
    agencyId: agency._id,
    name: zoneName,
    provinces,
    calculationMode: ["ZONA 11", "ZONA 12"].includes(zoneName)
      ? "weight_volume"
      : "pallet"
  }));

  await Zone.insertMany(zonesToInsert);

  console.log("✅ Zonas de Cayco importadas correctamente");
}