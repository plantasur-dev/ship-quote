
import mongoose from 'mongoose';

import { 
    registerDefaultUser 
} from './users/users.bootstrap.js';

import { 
    initProvinces, 
    loadProvinces
} from '../../api/services/provinces.service.js';

import { 
    loadCountries 
} from "../../api/services/countries.service.js";

import { 
    agencies 
} from './agencies/agencies.js';

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

    await Promise.all([
        registerDefaultUser(),
        loadCountries(),
        loadProvinces()
    ]);

    await agencies();

    await zonesCayco();
    await palletTypesCayco();
    await ratesCayco();

    await zonesTecum();
    await palletTypesTecum();
    await ratesTecum();

    await ratesCorreos();
    await zonesCorreos();

    await rateMrw();
    await zoneMrw();

    await zonesRhenus();
    await ratesRhenus();
}

export default bootstrap;