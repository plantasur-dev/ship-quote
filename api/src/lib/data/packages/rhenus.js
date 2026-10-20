import rhenusData from './rhenus.json' with { type: 'json' };
import { createRhenusZones } from '../rhenus.data.js';

const rhenusPackage = {
    ...rhenusData,
    loadDynamicData: async () => {
        const data = await createRhenusZones();

        return {
            zones: data.zones,
            rules: { exceptions: data.postalCodeExceptions }
        };
    }
};

export default rhenusPackage;
