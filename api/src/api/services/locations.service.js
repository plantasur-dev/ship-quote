
import { countryLang } from "../../lib/configs/country.lang.config.js";

export async function listCountries() {

    try {
        const res = await fetch(process.env?.COUNTRIES_URL || '');

        const countries = await res.json();

        const countriesObj = {};

        countries.forEach(country => {
            const translations = country.translations.reduce((acc, t) => {
                acc[t.lang] = t.common;
                return acc;
            }, {});

            Object.entries(countryLang).forEach(([baseCode, langCode]) => {
                if (!countriesObj[baseCode]) {
                    countriesObj[baseCode] = [];
                }

                countriesObj[baseCode].push({
                    countryCode: country.cca2,
                    countryName: translations[langCode] || country.name.common
                });
            });
        });
 
        return countriesObj;
    } catch (err) {
        console.error("Error loading country ", err);
        return { error: 502, message: 'Failed to fetch countries. ' + err };
    } 
};