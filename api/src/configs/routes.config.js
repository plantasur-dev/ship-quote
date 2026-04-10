
import { Router } from "express";
import createHttpError from "http-errors";

import * as Rate from '../controllers/rates.controller.js';
import * as Agencies from '../controllers/agency.controller.js';

const router = Router();

router.post('/agencies', Agencies.create);
router.get('/agencies', Agencies.list);

router.post("/rate/compare/v3", Rate.compareV3);
router.post("/rate/compare/v2", Rate.compareV2);
router.post("/rate/compare", Rate.compare);

router.use((req, res) => {
  throw new createHttpError(404, "Route Not Found");
});

export default router;