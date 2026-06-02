
import { connectDB } from './db.config.js';

import { initLocations } from '../../api/services/location.zone.service.js';

import bootstrap from '../bootstrap/bootstrap.js';

import logger from '../logger/logger.js';

async function startServer() {
    await connectDB();
    await initLocations();
    await bootstrap();
}

startServer();

logger.info({
    event: 'startup_Bootstrap',
    message: 'Environment data loaded',
    component: 'database'
});