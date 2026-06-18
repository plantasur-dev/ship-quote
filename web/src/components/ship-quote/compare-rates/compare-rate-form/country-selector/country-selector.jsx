
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { findCountriesByName } from "../../utils/compare-rate-utils";

function CountrySelector({ countries, isLoadingCountries }) {

    const { 
        setValue,
        resetField
    } = useFormContext();
 
    const [searchLocation, setSearchLocation] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
   
    const countriesFilter = findCountriesByName(countries, searchLocation);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
                País destino
            </label>

            <div className="relative">
                <input
                    value={ searchLocation }

                    placeholder={
                        isLoadingCountries
                            ? "Cargando países..."
                            : "Buscar país..."
                    }

                    onChange={(e) => {
                        setSearchLocation(e.target.value);
                        setShowDropdown(true);
                    }}

                    onFocus={() => setShowDropdown(true)}

                    disabled={ isLoadingCountries }

                    className="
                        h-12
                        w-full
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white/80
                        px-4
                        pr-10
                        text-sm
                        text-slate-900
                        shadow-sm
                        outline-none
                        transition-all
                        duration-200

                        placeholder:text-slate-400

                        hover:border-slate-300

                        focus:border-indigo-500
                        focus:ring-4
                        focus:ring-indigo-500/10
                    "
                />

                <div className="absolute inset-y-0 right-4 flex items-center text-slate-400">
                    🌍
                </div>
            </div>

            { showDropdown && searchLocation && (
                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white/95
                        shadow-xl
                        backdrop-blur-xl
                    "
                >
                    <div className="max-h-64 overflow-y-auto py-2">
                        {
                            !isLoadingCountries &&
                            countriesFilter.map((item) => (
                                <button
                                    type="button"

                                    key={ item.countryCode }

                                    onClick={() => {
                                        setSearchLocation(item.countryName);
                                        setValue("countryCode", item.countryCode);
                                        resetField('destinationPostalCode');
                                        setShowDropdown(false);
                                    }}

                                    className="
                                        flex
                                        w-full
                                        items-center
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        text-slate-700
                                        transition-colors

                                        hover:bg-indigo-50
                                        hover:text-indigo-700

                                        cursor-pointer
                                    "
                                >
                                    { item.countryName }
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

export default CountrySelector;