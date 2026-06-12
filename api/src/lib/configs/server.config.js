
import { connectDB } from './db.config.js';

import { 
    initProvinces, 
    loadProvinces 
} from '../../api/services/provinces.service.js';

import { loadCountries } from '../../api/services/countries.service.js';

import bootstrap from '../bootstrap/bootstrap.js';

import { loadAgencyTariffs, getAgencyTariffs } from '../../api/services/cache.service.js';

async function startServer() {
    await connectDB();

    await initProvinces();
    await bootstrap();

    await Promise.all([
        loadCountries(),
        loadProvinces()
    ]);

    await loadAgencyTariffs();
}

await startServer();