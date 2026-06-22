
import express from "express";

import httpLogger from "./src/lib/logger/morgan.js";

import cors from 'cors';

import docRouter from "./src/api/docs/index.js";
import apiRouter from "./src/api/index.js";
import webRoute from './web/index.js';

const app = express()

const PORT = process.env.PORT || 3000;

app.use(httpLogger);

app.use(cors());

app.use(express.json());

app.use('/api-docs', docRouter);

app.use('/api/v1', apiRouter);

app.use(webRoute);

export default app;