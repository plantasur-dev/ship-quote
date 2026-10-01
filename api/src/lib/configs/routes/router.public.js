
import { Router } from "express";
import {
    schemaValidation,
    rateItemsValidation,  
    rateDestinationValidation,
} from '../../../api/middlewares/index.js';

import * as Users from '../../../api/controllers/users.controller.js';
import * as Locations from '../../../api/controllers/locations.controller.js';
import * as Rates from '../../../api/controllers/rates.controller.js';
import * as Releases from '../../../api/controllers/releases.controller.js';

import { publicLimiter, loginLimiter } from "../rate.limit.config.js";

const publicRouter = Router();

publicRouter.get('/releases/latest', publicLimiter, Releases.latest);

publicRouter.post('/auth/login', loginLimiter, Users.login);

publicRouter.get('/locations/countries', publicLimiter, Locations.listCountries);
publicRouter.get('/locations/provinces', publicLimiter, Locations.listProvinces);
publicRouter.get('/locations/countries/:countryCode/provinces', publicLimiter, Locations.listCountryProvinces);
publicRouter.get('/locations/countries/:countryCode/provinces/:postalCode', publicLimiter, Locations.getProvince);

publicRouter.post(
    '/rates/compare/postal-code',
    publicLimiter, 
    schemaValidation,
    rateDestinationValidation,
    rateItemsValidation,
    Rates.compareByPostalCode
);

export default publicRouter;