
import { Router } from "express";

import { errorHandler, routerNotFound } from './middlewares/errors.middleware.js';

import { schemaValidation } from './middlewares/schemaValidation.middleware.js';

import * as Rate from './controllers/rates.controller.js';
import * as Agencies from './controllers/agencies.controller.js';

const apiRouter = Router();

apiRouter.use(schemaValidation);

apiRouter.post('/agencies', Agencies.create);
apiRouter.get('/agencies', Agencies.list);

apiRouter.post("/rate/compare", Rate.compare);

apiRouter.use(routerNotFound);

apiRouter.use(errorHandler);

export default apiRouter;