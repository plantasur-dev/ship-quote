
import Agency from "../../models/agency.model.js";
import Zone from "../../models/zone.model.js";

const zonesRaw = [
  { province: "Madrid", zone: "ZONA 1" },
  { province: "Toledo", zone: "ZONA 2" },
  { province: "Avila", zone: "ZONA 3" },
  { province: "Guadalajara", zone: "ZONA 3" },
  { province: "Segovia", zone: "ZONA 3" },
  { province: "Valladolid", zone: "ZONA 3" },

  { province: "Alava", zone: "ZONA 4" },
  { province: "Alicante", zone: "ZONA 4" },
  { province: "Burgos", zone: "ZONA 4" },
  { province: "Castellon", zone: "ZONA 4" },
  { province: "Leon", zone: "ZONA 4" },
  { province: "Rioja", zone: "ZONA 4" },
  { province: "Murcia", zone: "ZONA 4" },
  { province: "Salamanca", zone: "ZONA 4" },
  { province: "Soria", zone: "ZONA 4" },
  { province: "Teruel", zone: "ZONA 4" },
  { province: "Valencia", zone: "ZONA 4" },
  { province: "Zaragoza", zone: "ZONA 4" },
  { province: "C.Real", zone: "ZONA 4" },

  { province: "Asturias", zone: "ZONA 5" },
  { province: "Cantabria", zone: "ZONA 5" },
  { province: "Cuenca", zone: "ZONA 5" },
  { province: "Gipuzcoa", zone: "ZONA 5" },
  { province: "Navarra", zone: "ZONA 5" },
  { province: "Vizcaya", zone: "ZONA 5" },
  { province: "Palencia", zone: "ZONA 5" },
  { province: "Albacete", zone: "ZONA 5" },
  { province: "Zamora", zone: "ZONA 5" },

  { province: "Barcelona", zone: "ZONA 6" },
  { province: "Huesca", zone: "ZONA 6" },
  { province: "Tarragona", zone: "ZONA 6" },

  { province: "A Coruña", zone: "ZONA 7" },
  { province: "Gerona", zone: "ZONA 7" },
  { province: "Lugo", zone: "ZONA 7" },
  { province: "Orense", zone: "ZONA 7" },
  { province: "Pontevedra", zone: "ZONA 7" },
  { province: "Caceres", zone: "ZONA 7" },
  { province: "Badajoz", zone: "ZONA 7" },
  { province: "Lerida", zone: "ZONA 7" },

  { province: "Almeria", zone: "ZONA 11" },
  { province: "Jaen", zone: "ZONA 11" },
  { province: "Malaga", zone: "ZONA 11" },

  { province: "Sevilla", zone: "ZONA 12" },
  { province: "Cordoba", zone: "ZONA 12" }
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