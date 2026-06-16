
export const findCountriesByName = (countries = [], locationName = '') => {
    return countries?.filter(country => 
        country.countryName?.toLowerCase().includes(locationName?.toLowerCase())
    );
}

export const findProvinceByPostalCode = (provinces = [], postalCode = '') => {
    return provinces?.find(province => 
        String(province?.postalCode) === postalCode.slice(0, 2)
    );
}