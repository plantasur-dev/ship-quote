
import { 
    zonesCayco, 
    palletTypesCayco, 
    ratesCayco
} from './index.js';

async function initCayco() {
    await zonesCayco();
    await palletTypesCayco();
    await ratesCayco();    
}

export default initCayco;
