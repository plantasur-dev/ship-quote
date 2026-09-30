
import { Router } from "express";
import { audit } from './middlewares/index.js';
import * as Errors from './middlewares/errors.middleware.js';

import publicRouter from "../lib/configs/routes/router.public.js";
import privateRouter from "../lib/configs/routes/routes.private.js";

const apiRouter = Router();

apiRouter.use(audit);

apiRouter.use(publicRouter);
apiRouter.use(privateRouter);

apiRouter.use(Errors.routerNotFound);

apiRouter.use(Errors.errorHandler);

export default apiRouter;