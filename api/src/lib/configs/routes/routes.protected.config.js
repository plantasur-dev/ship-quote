
import { Router } from "express";
import {
    checkAuth,
    schemaValidation,
    agenciesValidation,
    updateAgenciesValidation,
    rateValidation,
    rateItemsValidation,  
    rateDestinationValidation,
    zoneValidation, 
    zoneFullValidation
} from '../../../api/middlewares/index.js';

import * as Users from '../../../api/controllers/users.controller.js';
import * as Agencies from '../../../api/controllers/agencies.controller.js';
import * as Locations from '../../../api/controllers/locations.controller.js';
import * as Pallets from '../../../api/controllers/palletTypes.controller.js';
import * as Rates from '../../../api/controllers/rates.controller.js';
import * as Zones from '../../../api/controllers/zones.controller.js';
import * as ZoneRules from '../../../api/controllers/zoneRules.controller.js';
import * as Cache from '../../../api/controllers/cache.controller.js';
import * as Audits from '../../../api/controllers/audits.controller.js';


const protectedRouter = Router();

protectedRouter.use(checkAuth);

protectedRouter.post('/auth/signup', Users.create);
protectedRouter.delete('/auth/logout', Users.logout);
protectedRouter.get('/auth/verify', Users.verify);

protectedRouter.get('/debug/maps', Cache.debugMap);

protectedRouter.get('/audits', Audits.list);
protectedRouter.get('/audits/recent-activity', Audits.recentActivity);
protectedRouter.get('/audits/most-queried-postal', Audits.mostQueriedPostalCode);
protectedRouter.get('/audits/stats', Audits.stats);
protectedRouter.get('/audits/:activityId', Audits.detail);

protectedRouter.post(
    '/agencies', 
    schemaValidation, 
    agenciesValidation, 
    Agencies.create
);
protectedRouter.get('/agencies', Agencies.list);
protectedRouter.get('/agencies/:agencyId/pallets', Pallets.palletsByAgency);
protectedRouter.get('/agencies/:agencyId', Agencies.details);
protectedRouter.patch('/agencies/:agencyId/active', Agencies.toggleAgencyActive);
protectedRouter.patch(
    '/agencies/:agencyId/supplements/fuel-surcharge',
    schemaValidation, 
    Agencies.updateFuelSurcharge);
protectedRouter.patch(
    '/agencies/:agencyId', 
    schemaValidation, 
    updateAgenciesValidation, 
    Agencies.update
);
protectedRouter.delete('/agencies/:agencyId', Agencies.remove);

protectedRouter.post('/locations', schemaValidation, Locations.create);

protectedRouter.post('/pallets', schemaValidation, Pallets.create);
protectedRouter.get('/pallets', Pallets.list);
protectedRouter.get('/pallets/:palletTypeId', Pallets.details);
protectedRouter.delete('/pallets/:palletTypeId', Pallets.remove);

protectedRouter.post(
    '/zones',
    schemaValidation,
    zoneValidation,
    Zones.create
);
protectedRouter.post(
    '/zones/with-rules',
    schemaValidation,
    zoneFullValidation,
    Zones.createWithRules
);
protectedRouter.post('/zones/:zoneId/rules', schemaValidation, ZoneRules.create);
protectedRouter.get('/zones', Zones.list);
protectedRouter.get('/zones/:zoneId/rules', ZoneRules.details);
protectedRouter.get('/zones/:zoneId', Zones.details);

protectedRouter.post('/rates',
    schemaValidation,
    rateValidation,
    Rates.create
);
protectedRouter.post(
    '/rates/compare/province', 
    schemaValidation,
    rateDestinationValidation,
    rateItemsValidation,
    Rates.compareByProvince
);

export default protectedRouter;