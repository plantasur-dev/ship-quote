
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { findCountriesByName } from "../../compare-rate-utils/compare-rate-utils";

function CountrySelector({ countries, isLoadingCountries }) {

    const { setValue } = useFormContext();
 
    const [searchLocation, setSearchLocation] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
   
    const countriesFilter = findCountriesByName(countries, searchLocation);

    return (
        <div>
            <label className="text-sm text-slate-500">País</label>

            <input
                value={ searchLocation }
                
                placeholder={ isLoadingCountries ? "Cargando paises..." : "País" }
                
                onChange={(e) => {
                    setSearchLocation(e.target.value);
                    setShowDropdown(true);
                }}

                onFocus={ () => setShowDropdown(true) }
                
                disabled={ isLoadingCountries }
                
                className="
                    w-full 
                    mt-1 
                    px-4 
                    py-3 
                    rounded-lg 
                    bg-white/70 
                    border 
                    border-slate-200 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-indigo-400
                "
            />

            { showDropdown && searchLocation && (
                <div className="mt-2 bg-white border rounded-xl shadow max-h-60 overflow-y-auto">
                    { !isLoadingCountries && countriesFilter.map((item) => (
                        <div
                            key={ item.countryCode }

                            onClick={() => {
                                setSearchLocation(item.countryName);
                                setValue("countryCode", item.countryCode);
                                setShowDropdown(false);
                            }}

                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                        >
                            { item.countryName }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CountrySelector;