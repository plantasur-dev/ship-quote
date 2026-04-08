
import "../config/db.config.js";

import { seedAgencies } from './caycoSeeds/caycoAgencies.seed.js';
import { seedZones } from './caycoSeeds/caycoZones.seed.js';
import { seedPalletTypes } from './caycoSeeds/caycoPalletTypes.seed.js';
import { seedRates } from './caycoSeeds/caycoRates.v2.seed.js';
import { seedRatesAndalucia } from './caycoSeeds/caycoRatesAndalucia.seed.js';

await seedAgencies();

await seedZones();

await seedPalletTypes();

await seedRates();

await seedRatesAndalucia();

process.exit();