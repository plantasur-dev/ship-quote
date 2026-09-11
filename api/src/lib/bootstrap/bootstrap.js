
import mongoose from 'mongoose';

import initUser from './users/init.users.js';
import initAgencies from './agencies/init.agencies.js';
import initAgenciesData from './agencies/init.agencies.data.js';
import { 
    initProvinces, 
    loadProvinces
} from '../../api/services/provinces.service.js';

import { 
    loadCountries 
} from "../../api/services/countries.service.js";


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
        loadCountries(),
        loadProvinces(),
        initUser(),
        initAgencies(),
    ]);

    await initAgenciesData();
}

export default bootstrap;