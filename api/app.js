
import express from "express";

import morgan from "morgan";

import cors from 'cors';

import './src/lib/configs/server.config.js';

import apiRouter from "./src/api/index.js";

import webRoute from './web/index.js';


const app = express()

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'test') {
    app.use(morgan("dev"));
}

app.use(cors());

app.use(express.json());

app.use('/api/v1', apiRouter);

app.use(webRoute);

app.listen(PORT, '0.0.0.0',() => {
    console.log(`App listening on port ${ PORT }`);
});