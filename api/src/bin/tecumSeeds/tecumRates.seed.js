
import Agency from "../../models/agency.model.js";
import Rate from "../../models/rate.model.js";
import PalletType from "../../models/palletType.model.js";

// helper
const fixed = (price) => [{ min: 1, max: 999, price }];

// ---------------- DATA ----------------

const tablePremium = {
  "ZONA 21": [37.07, 39.39, 44.86, 46.19],
  "ZONA 22": [38.71, 42.33, 48.69, 51.15],
  "ZONA 23": [39.69, 44.44, 50.75, 53.19],
  "ZONA 24": [41.39, 46.33, 52.59, 55.24],
  "ZONA 25": [42.81, 47.60, 54.41, 57.59],
  "ZONA 1":  [39.48, 41.81, 53.68, 58.53],
  "ZONA 2":  [40.65, 42.98, 54.85, 59.70],
  "ZONA 3":  [42.00, 44.33, 56.71, 62.20],
  "ZONA 4":  [45.48, 47.82, 59.74, 64.53],
  "ZONA 5":  [47.62, 50.00, 62.21, 67.42],
  "ZONA 6":  [48.81, 52.96, 66.35, 73.36],
  "ZONA 7":  [49.57, 53.64, 70.23, 82.01],
  "ZONA 8":  [57.27, 65.04, 84.41, 100.39],
  "ZONA 9":  [77.80, 93.73, 117.19, 140.92],
  "ZONA 10": [79.99, 96.47, 119.93, 143.66],
  "ZONA 11": [83.35, 99.83, 121.29, 145.02],
  "ZONA 12": [121.79, 145.96, 168.30, 193.34],
  "ZONA 13": [139.88, 179.21, 272.45, 251.72],
  "ZONA 14": [145.06, 194.74, 297.29, 275.52]
};

const tableEconomy = {
  "ZONA 21": [35.14, 36.29, 42.20, 44.16],
  "ZONA 22": [36.68, 37.87, 44.81, 48.34],
  "ZONA 23": [37.69, 38.85, 46.21, 50.40],
  "ZONA 24": [39.29, 40.52, 48.49, 53.55],
  "ZONA 25": [40.74, 41.93, 50.27, 55.92],
  "ZONA 1":  [37.52, 41.83, 50.21, 55.32],
  "ZONA 2":  [38.67, 42.98, 51.59, 57.05],
  "ZONA 3":  [39.90, 44.20, 53.32, 59.42],
  "ZONA 4":  [43.36, 47.67, 55.86, 60.58],
  "ZONA 5":  [44.83, 49.18, 57.66, 62.77],
  "ZONA 6":  [45.42, 50.95, 61.07, 68.66],
  "ZONA 7":  [46.23, 51.70, 64.05, 74.99],
  "ZONA 8":  [52.61, 61.69, 77.03, 92.45],
  "ZONA 9":  [72.99, 87.12, 108.69, 129.60],
  "ZONA 10": [74.62, 89.85, 111.41, 132.32],
  "ZONA 16": [16.00, 19.00, 27.00, 27.00],
  "ZONA 17": [27.00, 27.00, 27.00, 27.00]
};

const table = {
    "ZONA 21": [37.07, 39.39, 44.86, 46.19, 35.14, 36.29, 42.20, 44.16],
    "ZONA 22": [38.71, 42.33, 48.69, 51.15, 36.68, 37.87, 44.81, 48.34],
    "ZONA 23": [39.69, 44.44, 50.75, 53.19, 37.69, 38.85, 46.21, 50.40],
    "ZONA 24": [41.39, 46.33, 52.59, 55.24, 39.29, 40.52, 48.49, 53.55],
    "ZONA 25": [42.81, 47.60, 54.41, 57.59, 40.74, 41.93, 50.27, 55.92],
    "ZONA 1":  [39.48, 41.81, 53.68, 58.53, 37.52, 41.83, 50.21, 55.32],
    "ZONA 2":  [40.65, 42.98, 54.85, 59.70, 38.67, 42.98, 51.59, 57.05],
    "ZONA 3":  [42.00, 44.33, 56.71, 62.20, 39.90, 44.20, 53.32, 59.42],
    "ZONA 4":  [45.48, 47.82, 59.74, 64.53, 43.36, 47.67, 55.86, 60.58],
    "ZONA 5":  [47.62, 50.00, 62.21, 67.42, 44.83, 49.18, 57.66, 62.77],
    "ZONA 6":  [48.81, 52.96, 66.35, 73.36, 45.42, 50.95, 61.07, 68.66],
    "ZONA 7":  [49.57, 53.64, 70.23, 82.01, 46.23, 51.70, 64.05, 74.99],
    "ZONA 8":  [57.27, 65.04, 84.41, 100.39, 52.61, 61.69, 77.03, 92.45],
    "ZONA 9":  [77.80, 93.73, 117.19, 140.92, 72.99, 87.12, 108.69, 129.60],
    "ZONA 10": [79.99, 96.47, 119.93, 143.66, 74.62, 89.85, 111.41, 132.32],
    "ZONA 11": [83.35, 99.83, 121.29, 145.02, 83.35, 99.83, 121.29, 145.02], // si cambian pesos altos, ajusta
    "ZONA 12": [121.79, 145.96, 168.30, 193.34, 121.79, 145.96, 168.30, 193.34]
  };

const palletMap = [
  "MINI QUARTER PALLET",
  "QUARTER PALLET",
  "SUPER EURO LIGHT PALLET",
  "HALF PALLET"
];

// ---------------- MAIN ----------------

export async function seedTecumRates() {

  const agency = await Agency.findOne({ code: "tecum" });
  if (!agency) throw new Error("No existe TECUM");

  const palletTypes = await PalletType.find({ agencyId: agency._id });

  await Rate.deleteMany({ agencyId: agency._id });

  const inserts = [];

  for (const [zone, prices] of Object.entries(table)) {

    for (let i = 0; i < palletMap.length; i++) {

      const palletName = palletMap[i];
      const pallet = palletTypes.find(p => p.name === palletName);

      if (!pallet) {
        console.warn(`⚠️ Pallet no encontrado: ${palletName}`);
        continue;
      }

      inserts.push({
        agencyId: agency._id,
        type: "pallet",
        zoneName: zone,
        palletTypeId: pallet._id,
        services: [
          {
            service: 'premium',
            priceBreaks: fixed(prices[i]),
          }, 
          {
            service: 'economy',
            priceBreaks: fixed(prices[i + 4]),
          }
        ]
      });
    }
  }

  await Rate.insertMany(inserts);

  console.log("✅ Tarifas TECUM importadas");
}