
import { connectDB } from './db.config.js';

import { initLocations } from '../../api/services/location.zone.service.js';

import bootstrap from '../bootstrap/bootstrap.js';

async function startServer() {
    await connectDB();
    await initLocations();
    await bootstrap();
}

startServer();