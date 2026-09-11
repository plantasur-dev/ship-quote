
import { 
    zonesTecum, 
    palletTypesTecum, 
    ratesTecum 
} from './index.js';

async function initTecum() {
    await zonesTecum();
    await palletTypesTecum();
    await ratesTecum();
}

export default initTecum;