
import { getProvincesByCountryCode } from '../../api/services/provinces.service.js';

import { prefixZone } from '../utils/bootstrap.utils.js';

const countries = ['IT', 'DE', 'FR', 'BE', 'AT', 'CZ'];

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