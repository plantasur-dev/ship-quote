
import { connectDB } from "../lib/configs/db.config.js";

await connectDB();

import { seedAgencies } from './agencies.seed.js';

import { 
    seedZones, 
    seedPalletTypes, 
    seedRates, 
    seedRatesAndalucia 
} from './caycoSeeds/index.js';

import { 
    seedTecumZones, 
    seedTecumPalletTypes, 
    seedTecumRates, 
    seedTecumRatesByQuantity 
} from './tecumSeeds/index.js';

await seedAgencies();

await seedZones();
await seedTecumZones();

await seedPalletTypes();
await seedTecumPalletTypes();

await seedRates();
await seedRatesAndalucia();

await seedTecumRates();

await seedTecumRatesByQuantity('tecum');

process.exit();