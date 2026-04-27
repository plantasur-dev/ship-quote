
export async function listCountries() {

    try {
        const res = await fetch(`https://restcountries.com/v4/all?fields=translations,cca2,name`);

        const countries = await res.json();

        const countryLang = {
            'ES':'spa', 
            'IT':'ita', 
            'FR':'fra', 
            'US':'en'
        };

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
        console.error("Error cargando países:", err);
        return { error: 502, message: 'Failed to fetch countries. '+ err}
    } 
};