
import initAgencyData from './agency-data.initializer.js';
import caycoPackage from '../../data/packages/cayco.json' with { type: 'json' };
import correosexpressPackage from '../../data/packages/correosexpress.json' with { type: 'json' };
import mrwPackage from '../../data/packages/mrw.json' with { type: 'json' };
import rhenusPackage from '../../data/packages/rhenus.js';
import tecumPackage from '../../data/packages/tecum.json' with { type: 'json' };

const agencyPackages = [
    caycoPackage,
    tecumPackage,
    correosexpressPackage,
    mrwPackage,
    rhenusPackage
];

async function initAgenciesData() {
    for (const agencyPackage of agencyPackages) {
        await initAgencyData(agencyPackage);
    }
}

export default initAgenciesData;
