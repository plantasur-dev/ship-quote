
import { italyRates } from './rhenus-data/italy/rates.data.js';
import { germanyRates } from './rhenus-data/germany/rates.data.js';

import { italyZones } from './rhenus-data/italy/zones.data.js';
import { germanyZones } from './rhenus-data/germany/zones.data.js';

export const rhenusRates = { 
    ...italyRates, 
    ...germanyRates
};

export const rhenusZones = {
    zones: [
        ...italyZones.zones,
        ...germanyZones.zones,
    ],
    calculationMode: "pallet",
    pricingMode: { type: "weight_volume" },
    volumetric: {
        enabled: true,
        factor: 250,
    },
    postalCodeExceptions: [
        ...italyZones.postalCodeExceptions,
        ...germanyZones.postalCodeExceptions,
    ],
};