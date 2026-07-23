
import { connectDB } from './db.config.js';

import { loadAgencyTariffs } from "../../api/services/cache.service.js";

import bootstrap from "../bootstrap/bootstrap.js";

export async function bootstrapApp() {
    await connectDB();

    await bootstrap();

    await loadAgencyTariffs();
}