
import express from 'express';

const routerWeb = express.Router();

const __dirname = import.meta.dirname;

routerWeb.use(express.static(`${__dirname}/build`));

routerWeb.get(/.*/, (req, res) => {
    res.sendFile(`${__dirname}/build/index.html`)
});

export default routerWeb;