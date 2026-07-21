
import mongoose from 'mongoose';

import { initProvinces } from '../../api/services/provinces.service.js';

import { agencies } from './agencies/agencies.js';

import { 
    zonesCayco, 
    palletTypesCayco, 
    ratesCayco
} from './agencies/cayco/index.js';

import { 
    zonesTecum, 
    palletTypesTecum, 
    ratesTecum 
} from './agencies/tecum/index.js';

import { 
    ratesCorreos, 
    zonesCorreos
} from "./agencies/cexp.js";

import {
    zoneMrw,
    rateMrw
} from './agencies/mrw.js';

import {
    ratesRhenus,
    zonesRhenus
} from './agencies/rhenus.js';

async function bootstrap() {

    if (process.env.NODE_ENV === 'test') {
        await mongoose.connect(process.env.MONGODB_URI_TEST);
  
        console.log(`Modo: ${ process.env.NODE_ENV } - Eliminando datos `);

        await mongoose.connection.db.dropDatabase();

        console.log(`Modo: ${ process.env.NODE_ENV } - Iniciando datos `);
    }

    if (!process.env.DEFAULT_COUNTRY) {
        throw new Error('DEFAULT_COUNTRY env var is not set');
    }

    await initProvinces();

    await agencies();

    await zonesCayco();
    await zonesTecum();

    await palletTypesCayco();
    await palletTypesTecum();

    await ratesCayco();

    await ratesTecum();

    await ratesCorreos();
    await zonesCorreos();

    await rateMrw();
    await zoneMrw();

    await ratesRhenus();
    await zonesRhenus();
}

export default bootstrap;