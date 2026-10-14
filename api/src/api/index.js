
import { Router } from "express";
import { audit } from './middlewares/index.js';
import * as Errors from './middlewares/errors.middleware.js';

import publicRouter from "../lib/configs/routes/routes.public.config.js";
import protectedRouter from "../lib/configs/routes/routes.protected.config.js";

const apiRouter = Router();

apiRouter.use(audit);

apiRouter.use(publicRouter);
apiRouter.use(protectedRouter);

apiRouter.use(Errors.routerNotFound);

apiRouter.use(Errors.errorHandler);

export default apiRouter;