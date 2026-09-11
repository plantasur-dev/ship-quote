
import initCayco from "./cayco/init.cayco.js";
import initCexp from "./cexp/init.cexp.js";
import initMrw from "./mrw/init.mrw.js";
import initRhenus from "./rhenus/init.rhenus.js";
import initTecum from "./tecum/init.tecum.js";


async function initAgenciesData() {    
        await initCayco();
        await initTecum();
        await initCexp();
        await initMrw();
        await initRhenus();
}

export default initAgenciesData;
