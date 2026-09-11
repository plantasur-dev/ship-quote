
import app from "./app.js";

import logger from "./src/lib/logger/logger.js";

import { bootstrapApp } from './src/lib/configs/server.config.js';

const PORT = process.env.PORT || 3000;
const URL = process.env.API_URL || 'localhost'

await bootstrapApp();

app.listen(PORT, URL, () => {
    console.log(`Server running on port ${ PORT }`);

    logger.info({
        event: 'server',
        service: 'ship-quote-api',
        message: `App listening on port ${ PORT }`,
        port: PORT
    });
});