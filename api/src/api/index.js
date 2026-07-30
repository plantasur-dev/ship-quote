
import { Router } from "express";

import * as Errors from './middlewares/errors.middleware.js';

import {
    schemaValidation,
    rateItemsValidation,  
    rateDestinationValidation,
    zoneValidation, 
    zoneFullValidation
} from './middlewares/index.js';

import * as Agencies from './controllers/agencies.controller.js';
import * as Locations from './controllers/locations.controller.js';
import * as Pallets from './controllers/palletTypes.controller.js';
import * as Rates from './controllers/rates.controller.js';
import * as Zones from './controllers/zones.controller.js';
import * as ZoneRules from './controllers/zoneRules.controller.js';
import * as Releases from './controllers/releases.controller.js';
import * as Cache from './controllers/cache.controller.js';

const apiRouter = Router();

apiRouter.get(
    '/debug/maps', 
    Cache.debugMap
);

apiRouter.get(
    '/releases/latest',
    Releases.latest
);

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
    '/locations/countries',
    Locations.listCountries
);

apiRouter.get(
    '/locations/provinces',
    Locations.listProvinces
);

apiRouter.get(
    '/locations/provincesByCountryCodeAndPostalCode/:countryCode/:postalCode',
    Locations.provincesByCountryCodeAndPostalCode
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

apiRouter.get(
    '/palletsByAgency/:agencyId',
    Pallets.palletsByAgency
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
    zoneValidation,
    Zones.create
);

apiRouter.post(
    '/zones/:zoneId/rules',
    schemaValidation,
    ZoneRules.create
);

apiRouter.post(
    '/zones/full',
    schemaValidation,
    zoneFullValidation,
    Zones.full
);

apiRouter.get(
    '/zones',
    Zones.list
);

apiRouter.get(
    '/zones/:zoneId/rules',
    ZoneRules.details
);

apiRouter.get(
    '/zones/:zoneId',
    Zones.details
);


apiRouter.post(
    '/rates/compareByProvinceCode', 
    schemaValidation,
    rateDestinationValidation,
    rateItemsValidation,
    Rates.compareByProvinceCode
);

apiRouter.post(
    '/rates/compareByPostalCode', 
    schemaValidation,
    rateDestinationValidation,
    rateItemsValidation,
    Rates.compareByPostalCode
);

apiRouter.use(Errors.routerNotFound);

apiRouter.use(Errors.errorHandler);

export default apiRouter;