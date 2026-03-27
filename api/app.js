
import express from "express";

import morgan from "morgan";

import "./config/db.config.js";

import router from "./config/routes.config.js";

const app = express()

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use(express.json());

app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})