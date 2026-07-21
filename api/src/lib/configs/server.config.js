
import { connectDB } from './db.config.js';

import { loadProvinces } from "../../api/services/provinces.service.js";
import { loadCountries } from "../../api/services/countries.service.js";
import { loadAgencyTariffs } from "../../api/services/cache.service.js";

import bootstrap from "../bootstrap/bootstrap.js";

export async function bootstrapApp() {
    await connectDB();

    await bootstrap();

    await Promise.all([
        loadCountries(),
        loadProvinces()
    ]);

    await loadAgencyTariffs();
}