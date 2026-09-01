
import { Router } from "express";

import * as Errors from './middlewares/errors.middleware.js';

import {
    checkAuth,
    audit,
    schemaValidation,
    agenciesValidation,
    updateAgenciesValidation,
    rateValidation,
    rateItemsValidation,  
    rateDestinationValidation,
    zoneValidation, 
    zoneFullValidation
} from './middlewares/index.js';

import * as Users from './controllers/users.controller.js';
import * as Agencies from './controllers/agencies.controller.js';
import * as Locations from './controllers/locations.controller.js';
import * as Pallets from './controllers/palletTypes.controller.js';
import * as Rates from './controllers/rates.controller.js';
import * as Zones from './controllers/zones.controller.js';
import * as ZoneRules from './controllers/zoneRules.controller.js';
import * as Releases from './controllers/releases.controller.js';
import * as Cache from './controllers/cache.controller.js';
import * as Audits from './controllers/audits.controller.js';

const apiRouter = Router();

apiRouter.use(checkAuth);

apiRouter.use(audit);

apiRouter.post('/auth/signup', Users.create);
apiRouter.post('/auth/login', Users.login);
apiRouter.delete('/auth/logout', Users.logout);
apiRouter.get('/auth/verify', Users.verify);

apiRouter.get('/debug/maps', checkAuth, Cache.debugMap);

apiRouter.get('/releases/latest', Releases.latest);

apiRouter.get('/audits', Audits.list)

apiRouter.post(
    '/agencies', 
    schemaValidation, 
    agenciesValidation, 
    Agencies.create
);
apiRouter.get('/agencies', Agencies.list);
apiRouter.get('/agencies/:agencyId/pallets', Pallets.palletsByAgency);
apiRouter.get('/agencies/:agencyId', Agencies.details);
apiRouter.patch('/agencies/:agencyId/active', Agencies.toggleAgencyActive);
apiRouter.patch(
    '/agencies/:agencyId/supplements/fuel-surcharge',
    schemaValidation, 
    Agencies.updateFuelSurcharge);
apiRouter.patch(
    '/agencies/:agencyId', 
    schemaValidation, 
    updateAgenciesValidation, 
    Agencies.update
);
apiRouter.delete('/agencies/:agencyId', Agencies.remove);

apiRouter.post('/locations', schemaValidation, Locations.create);
apiRouter.get('/locations/countries', Locations.listCountries);
apiRouter.get('/locations/provinces', Locations.listProvinces);
apiRouter.get(
    '/locations/provincesByCountryCodeAndPostalCode/:countryCode/:postalCode',
    Locations.provincesByCountryCodeAndPostalCode
);

apiRouter.post('/pallets', schemaValidation, Pallets.create);
apiRouter.get('/pallets', Pallets.list);
apiRouter.get('/pallets/:palletTypeId', Pallets.details);
apiRouter.delete('/pallets/:palletTypeId', Pallets.remove);

apiRouter.post(
    '/zones',
    schemaValidation,
    zoneValidation,
    Zones.create
);
apiRouter.post('/zones/:zoneId/rules', schemaValidation, ZoneRules.create);
apiRouter.post(
    '/zones/full',
    schemaValidation,
    zoneFullValidation,
    Zones.full
);
apiRouter.get('/zones', Zones.list);
apiRouter.get('/zones/:zoneId/rules', ZoneRules.details);
apiRouter.get('/zones/:zoneId', Zones.details);

apiRouter.post('/rates',
    schemaValidation,
    rateValidation,
    Rates.create
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