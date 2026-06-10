
import { countryLang } from "../../lib/configs/country.lang.config.js";

const countriesMap = new Map();

export async function loadCountries() {

    try {
        const res = await fetch(process.env?.COUNTRIES_URL || '');

        if (!res.ok) {
            throw new Error(`HTTP ${ res.status }`);
        }

        const countries = await res.json();

        countries.forEach(country => {
            const translations = country.translations.reduce((acc, t) => {
                acc[t.lang] = t.common;
                return acc;
            }, {});

            Object.entries(countryLang).forEach(([baseCode, langCode]) => {
                if (!countriesMap.has(baseCode)) {
                    countriesMap.set(baseCode, []);
                }

                countriesMap.get(baseCode).push({
                    countryCode: country.cca2,
                    countryName: translations[langCode] || country.name.common
                });
            });
        });

    } catch (err) {
        console.error("Error loading country ", err);
        
        return {
            status: 502,
            message: 'Failed to fetch countries. ' + err
        };
    } 
};

export function listCountries(lang = 'ES') {
    return countriesMap.get(lang) || [];
}