
import { 
    ratesCorreos, 
    zonesCorreos
} from "./cexp.js";

async function initCexp() {
    await ratesCorreos();
    await zonesCorreos();
}

export default initCexp;