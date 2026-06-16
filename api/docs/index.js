
import { Router } from "express";

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import path from 'path';
import { fileURLToPath } from 'url';

const docRouter = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(
  path.join(__dirname, './openapi.yaml')
);

docRouter.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

export default docRouter;