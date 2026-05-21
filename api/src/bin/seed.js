
import { connectDB } from "../lib/configs/db.config.js";

await connectDB();

import { seedAgencies } from './agencies/agencies.seed.js';

import { 
    seedZonesCayco, 
    seedPalletTypesCayco, 
    seedRatesCayco, 
    seedRatesAndaluciaCayco 
} from './agencies/cayco/index.js';

import { 
    seedZonesTecum, 
    seedPalletTypesTecum, 
    seedRatesTecum, 
    seedRatesByQuantityTecum 
} from './agencies/tecum/index.js';

import { 
    seedRatesCorreos, 
    seedZonesCorreos
} from "./agencies/cexp.seed.js";

import {
    seedZoneMrw,
    seedRateMrw
} from './agencies/mrw.seed.js';

await seedAgencies();

await seedZonesCayco();
await seedZonesTecum();

await seedPalletTypesCayco();
await seedPalletTypesTecum();

await seedRatesCayco();
await seedRatesAndaluciaCayco();

await seedRatesTecum();
await seedRatesByQuantityTecum('tecum');

await seedRatesCorreos();
await seedZonesCorreos();

await seedRateMrw();
await seedZoneMrw();

process.exit();