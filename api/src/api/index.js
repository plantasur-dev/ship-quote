
import { Router } from "express";

import * as Errors from './middlewares/errors.middleware.js';

import { schemaValidation } from './middlewares/schema.validation.middleware.js';
import { rateValidation } from './middlewares/rate.validation.middleware.js';

import * as Agencies from './controllers/agencies.controller.js';
import * as Locations from './controllers/locations.controller.js';
import * as Pallets from './controllers/palletTypes.controller.js';
import * as Rates from './controllers/rates.controller.js';
import * as Zones from './controllers/zones.controller.js';

const apiRouter = Router();

apiRouter.post(
    '/agencies', 
    schemaValidation, 
    Agencies.create
);

apiRouter.get(
    '/agencies', 
    Agencies.list
);

apiRouter.patch(
    '/agencies/:agencyId', 
    Agencies.updateAgencyStatus
);


apiRouter.post(
    '/locations',
    schemaValidation,
    Locations.create
);

apiRouter.get(
    '/locations',
    Locations.list
);

apiRouter.get(
    '/locations/countries',
    Locations.countries
);

apiRouter.get(
    '/locations/:locationId',
    Locations.details
);


apiRouter.post(
    '/pallets',
    schemaValidation,
    Pallets.create
);

apiRouter.get(
    '/pallets',
    Pallets.list
);

apiRouter.post(
    '/pallets/compare',
    Pallets.compare
);

apiRouter.get(
    '/pallets/:palletTypeId',
    Pallets.details
);

apiRouter.delete(
    '/pallets/:palletTypeId',
    Pallets.remove
);


apiRouter.post(
    '/zones',
    schemaValidation,
    Zones.create
);

apiRouter.get(
    '/zones',
    Zones.list
);

apiRouter.get(
    '/zones/:zoneId',
    Zones.details
);


apiRouter.post(
    '/rates/compare', 
    schemaValidation,
    rateValidation,
    Rates.compare
);

apiRouter.use(Errors.routerNotFound);

apiRouter.use(Errors.errorHandler);

export default apiRouter;