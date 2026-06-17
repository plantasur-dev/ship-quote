
import { countryLang } from "../../lib/constants/country.lang.js";

const countriesMap = new Map();

async function fetchCountries(offset) {

    const res = await fetch(`${process.env?.COUNTRIES_URL}&limit=100&offset=${offset}`,
        { 
            headers: { 
                'Authorization': `Bearer ${process.env?.COUNTRIES_API_KEY}` 
            } 
        } 
    );
    
    if (res.status !== 200) {
        throw new Error(`HTTP ${ res.status }`);
    }

    return res.json();
}

export async function loadCountries() {

    try {
        if (process.env?.COUNTRIES_API_ENABLED === 'false') {
            throw new Error(`Countries enabled ${ process.env?.COUNTRIES_API_ENABLED }`); 
            return;
        }

        const [page1, page2, page3] = await Promise.all([
            fetchCountries(0),
            fetchCountries(100),
            fetchCountries(200)
        ]);

        const countries = [
            ...(page1.data?.objects ?? []),
            ...(page2.data?.objects ?? []),
            ...(page3.data?.objects ?? [])
        ];
                
        countries.forEach(country => {

            const countryCode = country.codes?.alpha_2;

            if (!countryCode) return;

            const translations = country.names?.translations;

            Object.entries(countryLang).forEach(([baseCode, langCode]) => {
                if (!countriesMap.has(baseCode)) {
                    countriesMap.set(baseCode, []);
                }

                countriesMap.get(baseCode).push({
                    countryCode,
                    countryName: translations?.[langCode]?.common ?? country.names?.common
                });
            });
        });
    } catch (err) {
        console.error("Error loading country ", err);
        
        return {
            message: 'Failed to fetch countries. ' + err
        };
    } 
};

export function listCountries(lang = 'ES') {
    return countriesMap.get(lang) || [];
}