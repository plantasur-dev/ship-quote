
import Agency from "../../models/agency.model.js";
import Rate from "../../models/rate.model.js";

const zona11 = [
  [50, 7.20], [60, 8.01], [70, 8.84], [80, 9.70], [90, 10.51],
  [100, 11.34], [120, 13.00], [140, 14.66], [160, 16.18],
  [180, 17.84], [200, 19.07], [230, 21.51], [260, 23.90],
  [290, 26.39], [320, 28.68], [350, 30.95], [380, 32.03],
  [410, 34.12], [440, 34.86], [470, 36.06], [500, 38.28],
  [550, 41.17], [600, 43.87], [650, 47.32], [700, 49.82],
  [750, 52.11], [800, 54.22], [850, 57.70], [900, 62.80],
  [1000, 67.07], [2000, 63.73], [3000, 53.92], [7000, 48.88]
];

const zona12 = [
  [50, 7.20], [60, 8.01], [70, 8.84], [80, 9.70], [90, 10.51],
  [100, 11.34], [120, 13.00], [140, 14.66], [160, 16.18],
  [180, 17.84], [200, 19.07], [230, 21.51], [260, 23.90],
  [290, 26.39], [320, 28.68], [350, 30.95], [380, 32.03],
  [410, 34.12], [440, 34.86], [470, 36.06], [500, 38.28],
  [550, 41.17], [600, 43.87], [650, 47.32], [700, 49.82],
  [750, 52.11], [800, 54.22], [850, 57.70], [900, 62.80],
  [1000, 67.07], [2000, 63.73], [3000, 53.92], [7000, 47.25] 
];

function buildBreaks(data) {
  return data.map(([min, price], i) => {
    const next = data[i + 1];
    const max = next ? next[0] - 1 : 1000000;

    return { min, max, price };
  });
}

export async function seedRatesAndalucia() {
  
  const agency = await Agency.findOne({ code: "cayco" });

  await Rate.deleteMany({
    agencyId: agency._id,
    zoneName: { $in: ["ZONA 11", "ZONA 12"] }
  });

  await Rate.insertMany([
    {
      agencyId: agency._id,
      type: "pallet",
      zoneName: "ZONA 11",
      priceBreaks: buildBreaks(zona11)
    },
    {
      agencyId: agency._id,
      type: "pallet",
      zoneName: "ZONA 12",
      priceBreaks: buildBreaks(zona12)
    }
  ]);

  console.log("✅ Tarifas Andalucía importadas");
}