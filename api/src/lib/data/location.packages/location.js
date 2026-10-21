
import austriaPackage from './austria.json' with { type: 'json' };
import czechPackage from './czechRepublic.json' with { type: 'json' };
import belgiumPackage from './belgium.json' with { type: 'json' };
import germanyPackage from './germany.json' with { type: 'json' };
import italyPackage from './italy.json' with { type: 'json' };
import portugalPackage from './portugal.json' with { type: 'json' };
import francePackage from './france.json' with { type: 'json' };
import spainPackage from './spain.json' with { type: 'json' };

const provincesData = [
    ...austriaPackage.locations,
    ...czechPackage.locations,
    ...belgiumPackage.locations,
    ...germanyPackage.locations,
    ...italyPackage.locations,
    ...portugalPackage.locations,
    ...francePackage.locations,
    ...spainPackage.locations
];

export default provincesData;