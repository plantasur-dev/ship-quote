
import Agency from "../../models/agency.model.js";
import Rate from "../../models/rate.model.js";
import PalletType from "../../models/palletType.model.js";

// ---------------- HELPERS ----------------

function fixedPrice(price) {
  return [{ min: 1, max: 999, price }];
}

function buildBreaks(prices) {
  return prices.map((price, i) => ({
    min: i + 1,
    max: i + 1,
    price
  }));
}

function buildWeightBreaks(data) {
  return data.map((item, i) => {
    const min = i === 0 ? 0 : data[i - 1][0] + 1;
    const max = item[0];
    return { min, max, price: item[1] };
  });
}

// ---------------- DATA ----------------

const basicRates = {
  "ZONA 1": [28.43, 35.71, 44.10, 48.58, 44.51],
  "ZONA 2": [29.55, 36.82, 45.22, 49.70, 46.02],
  "ZONA 3": [30.67, 37.94, 47.46, 51.94, 46.92],
  "ZONA 4": [30.33, 38.17, 48.24, 52.72, 49.40],
  "ZONA 5": [35.71, 43.54, 51.94, 56.41, 51.23],
  "ZONA 6": [37.94, 45.89, 56.52, 62.57, 54.03],
  "ZONA 7": [39.06, 48.13, 63.24, 67.72, 58.01]
};

const basicNames = [
  "MINI",
  "CUARTO",
  "MEDIO",
  "LIGERO",
  "PLUMA"
];

const completoRates = {
  "ZONA 1": [54.45, 52.77, 51.66, 51.10, 50.54, 49.98, 49.42],
  "ZONA 2": [56.69, 55.01, 53.89, 53.33, 52.77, 52.22, 51.66],
  "ZONA 3": [60.05, 58.37, 57.25, 56.69, 56.13, 55.57, 55.01],
  "ZONA 4": [60.05, 58.37, 57.25, 56.69, 56.13, 55.57, 55.01],
  "ZONA 5": [69.00, 66.77, 65.65, 65.09, 64.53, 63.97, 63.41],
  "ZONA 6": [72.47, 69.12, 68.00, 66.88, 65.76, 64.64, 63.52],
  "ZONA 7": [82.55, 80.31, 77.96, 76.84, 74.71, 73.59, 73.03]
};

const superRates = {
  "ZONA 1": [63.41, 58.37, 57.25, 56.69, 56.13, 55.57, 55.01],
  "ZONA 2": [62.29, 60.61, 59.49, 58.93, 58.37, 57.81, 57.25],
  "ZONA 3": [65.65, 63.97, 62.85, 62.29, 61.73, 61.17, 60.61],
  "ZONA 4": [65.65, 63.97, 62.85, 62.29, 61.73, 61.17, 60.61],
  "ZONA 5": [74.60, 72.36, 71.24, 70.12, 69.56, 69.00, 67.89],
  "ZONA 6": [79.08, 76.95, 73.59, 72.47, 71.36, 70.24, 69.12],
  "ZONA 7": [90.27, 88.14, 85.91, 84.79, 83.67, 82.55, 81.43]
};

// ---------------- MAIN ----------------

export async function seedRates() {
  
  const agency = await Agency.findOne({ code: "cayco" });
  const palletTypes = await PalletType.find({ agencyId: agency._id });

  await Rate.deleteMany({ agencyId: agency._id });

  const inserts = [];

  for (const [zone, prices] of Object.entries(basicRates)) {
    for (let i = 0; i < basicNames.length; i++) {
      const pallet = palletTypes.find(p => p.name === basicNames[i]);
      if (!pallet) continue;

      inserts.push({
        agencyId: agency._id,
        type: "pallet",
        zoneName: zone,
        palletTypeId: pallet._id,
        services: {
          service: 'express',
          priceBreaks: fixedPrice(prices[i])
        }
      });
    }
  }

  const completoType = palletTypes.find(p => p.name === "COMPLETO");

  for (const [zone, prices] of Object.entries(completoRates)) {
    inserts.push({
      agencyId: agency._id,
      type: "pallet",
      zoneName: zone,
      palletTypeId: completoType._id,
      services: {
        service: 'express',
        priceBreaks: buildBreaks(prices)
      }
    });
  }

  const superType = palletTypes.find(p => p.name === "SUPER");

  for (const [zone, prices] of Object.entries(superRates)) {
    inserts.push({
      agencyId: agency._id,
      type: "pallet",
      zoneName: zone,
      palletTypeId: superType._id,
      services: {
        service: 'express',
        priceBreaks: buildBreaks(prices)
      }
    });
  }

  await Rate.insertMany(inserts);

  console.log("✅ Seed completo Cayco listo");
}