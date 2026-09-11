
import {
    ratesRhenus,
    zonesRhenus
} from './rhenus.js';

async function initRhenus() {
    await zonesRhenus();
    await ratesRhenus();
}

export default initRhenus;