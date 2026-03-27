
import { Router } from "express";
import createHttpError from "http-errors";
import * as Rate from '../controllers/rates.controller.js';

const router = Router();

router.post("/compare", Rate.compare);

router.use((req, res) => {
  throw new createHttpError(404, "Route Not Found");
});

export default router;