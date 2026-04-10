
import { connectDB } from "../configs/db.config.js";

await connectDB();

import { seedAgencies } from './agencies.seed.js';
import { seedZones } from './caycoSeeds/caycoZones.seed.js';
import { seedPalletTypes } from './caycoSeeds/caycoPalletTypes.seed.js';
import { seedRates } from './caycoSeeds/caycoRates.v2.seed.js';
import { seedRatesAndalucia } from './caycoSeeds/caycoRatesAndalucia.seed.js';

import { seedTecumZones } from './tecumSeeds/tecumZones.seed.js';
import { seedTecumPalletTypes } from './tecumSeeds/tecumPalletTypes.seeds.js';
import { seedTecumRates, seedRatesByQuantity } from './tecumSeeds/tecumRates.seed.js';

await seedAgencies();

await seedZones();
await seedTecumZones();

await seedPalletTypes();
await seedTecumPalletTypes();

await seedRates();
await seedRatesAndalucia();

await seedTecumRates();

process.exit();