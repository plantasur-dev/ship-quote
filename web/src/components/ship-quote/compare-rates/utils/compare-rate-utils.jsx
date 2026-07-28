
export const countryExists = (
    countries = [], 
    countryCode = '' 
) => (
    countries.some(country => 
    country?.countryCode === countryCode)
);

export const findCountriesByName = (
    countries = [], 
    locationName = ''
) => (
    countries?.filter(country => 
    country.countryName?.toLowerCase().includes(locationName.toLowerCase())
));

export const findProvinceByPostalCode = (
    provinces = [], 
    countryCode = 'ES', 
    postalCode = ''
) => (
    provinces?.find(province =>
    province?.countryCode === countryCode &&
    String(province?.postalCode) === (postalCode ?? '').slice(0, 2)
));