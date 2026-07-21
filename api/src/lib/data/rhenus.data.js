
import { prefixZone } from '../utils/bootstrap.utils.js';

const rangePostal = [
    prefixZone("00000", "IT-RM", "Italia-ZONA-00"),
    prefixZone("01000", "IT-RM", "Italia-ZONA-01"),
];

export const rhenusZones = {
    zones: [
        { name: "Italia-ZONA-00", provinces: ["IT-RM"] },
        { name: "Italia-ZONA-01", provinces: ["IT-RM"] }
    ],
    calculationMode: "pallet",
    pricingMode: { type: "weight_volume" },
    postalCodeExceptions: rangePostal
}

export const rhenusRates = {
    'Italia-ZONA-00': {
        service: "basic",
        priceBreaks: [
            { min: 0, max: 1, price: 100 },
            { min: 1, max: 2, price: 200 },
            { min: 2, max: 5, price: 300 },
            { min: 5, max: 10, price: 400 }
        ],
        fallbackToLastPrice: true,
        limits: {
            maxWeight: 3000
        }
    },
    'Italia-ZONA-01': {
        service: "basic",
        priceBreaks: [
            { min: 0, max: 1, price: 120 },
            { min: 1, max: 2, price: 220 },
            { min: 2, max: 5, price: 320 },
            { min: 5, max: 10, price: 420 }
        ],
        fallbackToLastPrice: true,
        limits: {
            maxWeight: 3000
        }
    },
};