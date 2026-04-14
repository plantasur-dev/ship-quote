
import express from "express";

import morgan from "morgan";

import './src/lib/configs/server.config.js';

import apiRouter from "./src/api/index.js";

const app = express()

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(express.json());

app.use('/api/v1', apiRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${ PORT }`)
});