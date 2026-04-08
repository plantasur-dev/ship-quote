
import express from "express";

import morgan from "morgan";

import "./config/db.config.js";

import router from "./config/routes.config.js";

import { errorHandler } from './middlewares/errors.middleware.js';

const app = express()

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(express.json());

app.use('/api/v1', router);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})