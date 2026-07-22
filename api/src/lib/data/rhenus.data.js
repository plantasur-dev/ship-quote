
import { italyRates } from './rhenus-data/italy/rates.data.js';

import { italyRangePostal, italyZones } from './rhenus-data/italy/zones.data.js';

export const rhenusRates = [
    { ...italyRates }
];

export const rhenusZones = [
    { ...italyZones, exceptions: italyRangePostal }
];