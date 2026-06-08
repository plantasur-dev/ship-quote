
import { connectDB } from './db.config.js';

import { initProvinces } from '../../api/services/provinces.service.js';

import bootstrap from '../bootstrap/bootstrap.js';

async function startServer() {
    await connectDB();
    await initProvinces();
    await bootstrap();
}

startServer();