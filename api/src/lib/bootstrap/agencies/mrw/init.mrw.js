
import {
    zoneMrw,
    rateMrw
} from './mrw.js';

async function initMrw() {
    await rateMrw();
    await zoneMrw();
}

export default initMrw;