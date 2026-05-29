
import { agencies } from './agencies/agencies.js';

import { 
    zonesCayco, 
    palletTypesCayco, 
    ratesCayco 
} from './agencies/cayco/index.js';

import { 
    zonesTecum, 
    palletTypesTecum, 
    ratesTecum 
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

    await ratesTecum();

    await ratesCorreos();
    await zonesCorreos();

    await rateMrw();
    await zoneMrw();
}

export default bootstrap;