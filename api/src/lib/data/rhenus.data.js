
import { getProvincesByCountryCode } from '../../api/services/provinces.service.js';

import { prefixZone } from '../utils/bootstrap.utils.js';

import { austriaRates } from './rhenus-data/austria/rates.data.js';
import { belgiumRates } from './rhenus-data/belgium/rates.data.js';
import { czechRates } from './rhenus-data/czech/rates.data.js';
import { franceRates } from './rhenus-data/france/rates.data.js';
import { italyRates } from './rhenus-data/italy/rates.data.js';
import { germanyRates } from './rhenus-data/germany/rates.data.js';

const countries = ['IT', 'DE', 'FR', 'BE', 'AT', 'CZ'];

export const rhenusRates = {
    ...austriaRates,
    ...belgiumRates,
    ...czechRates,
    ...franceRates, 
    ...italyRates, 
    ...germanyRates
};

export async function createRhenusZones() {
        
    const postalRanges = countries.map((country) => {
        const countryData = getProvincesByCountryCode(country);
        
        return countryData.map(({ postalCode, adminFullCode, countryName, adminCode }) => {
            const countryNameNormalize = countryName.replace(/\s+/g, "");

            return prefixZone(
                postalCode,
                adminFullCode,
                `${ countryNameNormalize }-${ adminCode }-${ postalCode }`
            );
        });
    });
    
    const zones = postalRanges.flat();

    return {
        zones: zones.map(zone => ({
            name: zone.zoneName,
            provinces: [zone.province]
        })),
        calculationMode: "pallet",
        pricingMode: { type: "weight_volume" },
        volumetric: {
            enabled: true,
            factor: 250
        },
        postalCodeExceptions: zones
    };
};