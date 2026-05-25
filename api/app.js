
import express from "express";

import logger from "./src/lib/looger/looger.js";

import httpLogger from "./src/lib/looger/morgan.js";

import cors from 'cors';

import './src/lib/configs/server.config.js';

import apiRouter from "./src/api/index.js";

import webRoute from './web/index.js';


const app = express()

const PORT = process.env.PORT || 3000;

const loggerMiddleware = 
    process.env.NODE_ENV === 'test'
        ? morgan("dev")
        : httpLogger;

app.use(loggerMiddleware);

app.use(cors());

app.use(express.json());

app.use('/api/v1', apiRouter);

app.use(webRoute);

app.listen(PORT, '0.0.0.0',() => {
    logger.info(`App listening on port ${ PORT }`);
});