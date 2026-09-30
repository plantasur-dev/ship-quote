
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


const privateRouter = Router();

privateRouter.use(checkAuth);

privateRouter.post('/auth/signup', Users.create);
privateRouter.delete('/auth/logout', Users.logout);
privateRouter.get('/auth/verify', Users.verify);

privateRouter.get('/debug/maps', Cache.debugMap);

privateRouter.get('/audits', Audits.list);
privateRouter.get('/audits/recent-activity', Audits.recentActivity);
privateRouter.get('/audits/most-queried-postal', Audits.mostQueriedPostalCode);
privateRouter.get('/audits/stats', Audits.stats);
privateRouter.get('/audits/:activityId', Audits.detail);

privateRouter.post(
    '/agencies', 
    schemaValidation, 
    agenciesValidation, 
    Agencies.create
);
privateRouter.get('/agencies', Agencies.list);
privateRouter.get('/agencies/:agencyId/pallets', Pallets.palletsByAgency);
privateRouter.get('/agencies/:agencyId', Agencies.details);
privateRouter.patch('/agencies/:agencyId/active', Agencies.toggleAgencyActive);
privateRouter.patch(
    '/agencies/:agencyId/supplements/fuel-surcharge',
    schemaValidation, 
    Agencies.updateFuelSurcharge);
privateRouter.patch(
    '/agencies/:agencyId', 
    schemaValidation, 
    updateAgenciesValidation, 
    Agencies.update
);
privateRouter.delete('/agencies/:agencyId', Agencies.remove);

privateRouter.post('/locations', schemaValidation, Locations.create);

privateRouter.post('/pallets', schemaValidation, Pallets.create);
privateRouter.get('/pallets', Pallets.list);
privateRouter.get('/pallets/:palletTypeId', Pallets.details);
privateRouter.delete('/pallets/:palletTypeId', Pallets.remove);

privateRouter.post(
    '/zones',
    schemaValidation,
    zoneValidation,
    Zones.create
);
privateRouter.post(
    '/zones/with-rules',
    schemaValidation,
    zoneFullValidation,
    Zones.createWithRules
);
privateRouter.post('/zones/:zoneId/rules', schemaValidation, ZoneRules.create);
privateRouter.get('/zones', Zones.list);
privateRouter.get('/zones/:zoneId/rules', ZoneRules.details);
privateRouter.get('/zones/:zoneId', Zones.details);

privateRouter.post('/rates',
    schemaValidation,
    rateValidation,
    Rates.create
);
privateRouter.post(
    '/rates/compare/province', 
    schemaValidation,
    rateDestinationValidation,
    rateItemsValidation,
    Rates.compareByProvince
);

export default privateRouter;