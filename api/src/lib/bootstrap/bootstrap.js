
import { agencies } from './agencies/agencies.js';

import { 
    zonesCayco, 
    palletTypesCayco, 
    ratesCayco, 
    ratesAndaluciaCayco 
} from './agencies/cayco/index.js';

import { 
    zonesTecum, 
    palletTypesTecum, 
    ratesTecum, 
    ratesByQuantityTecum 
} from './agencies/tecum/index.js';

import { 
    ratesCorreos, 
    zonesCorreos
} from "./agencies/cexp.js";

import {
    zoneMrw,
    rateMrw
} from './agencies/mrw.js';

async function bootstrap() {
    await agencies();

    await zonesCayco();
    await zonesTecum();

    await palletTypesCayco();
    await palletTypesTecum();

    await ratesCayco();
    await ratesAndaluciaCayco();

    await ratesTecum();
    await ratesByQuantityTecum('tecum');

    await ratesCorreos();
    await zonesCorreos();

    await rateMrw();
    await zoneMrw();
}

export default bootstrap;