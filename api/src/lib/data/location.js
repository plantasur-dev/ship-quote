
import { austriaLocations } from './locations-data/austria.js';
import { czech } from './locations-data/czechRepublic.js';
import { belgiumLocations } from './locations-data/belgium.js';
import { germanyLocations } from './locations-data/germany.js';
import { italyLocations } from './locations-data/italy.js';
import { portugalLocations } from './locations-data/portugal.js';
import { spainLocations } from './locations-data/spain.js';
import { franceLocations } from './locations-data/france.js';

export const provincesData = [
    ...austriaLocations,
    ...belgiumLocations,
    ...czech,
    ...germanyLocations,
    ...franceLocations,
    ...italyLocations,
    ...portugalLocations,
    ...spainLocations
];

export const specialIslands = [
    { countryCode: 'ES', countryName:'Spain' ,name: "Gran Canaria", adminCode: "GC-GC", postalCode: "35" },
    { countryCode: 'ES', countryName:'Spain' ,name: "Tenerife", adminCode: "TF-TE", postalCode: "38" },
    { countryCode: 'ES', countryName:'Spain' ,name: "Fuerteventura", adminCode: "GC-FU", postalCode: "35" },
    { countryCode: 'ES', countryName:'Spain' ,name: "Lanzarote", adminCode: "GC-LA", postalCode: "35" },
    { countryCode: 'ES', countryName:'Spain' ,name: "La Palma", adminCode: "TF-LP", postalCode: "38" },
    { countryCode: 'ES', countryName:'Spain' ,name: "La Gomera", adminCode: "TF-LG", postalCode: "38" },
    { countryCode: 'ES', countryName:'Spain' ,name: "El Hierro", adminCode: "TF-EH", postalCode: "38" },
    { countryCode: 'ES', countryName:'Spain' ,name: "Mallorca", adminCode: "BI-ML", postalCode: "07" },
    { countryCode: 'ES', countryName:'Spain' ,name: "Menorca", adminCode: "BI-MN", postalCode: "07" },
    { countryCode: 'ES', countryName:'Spain' ,name: "Ibiza", adminCode: "BI-IB", postalCode: "07" },
    { countryCode: 'ES', countryName:'Spain' ,name: "Formentera", adminCode: "BI-FE", postalCode: "07" }
];