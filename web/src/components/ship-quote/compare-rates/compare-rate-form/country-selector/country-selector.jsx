
import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert } from '.././../../../ui';
import { findCountriesByName } from "../../utils/compare-rate-utils";


function CountrySelector({ countries, isLoadingCountries }) {

    const { 
        setValue,
        resetField
    } = useFormContext();
 
    const [searchLocation, setSearchLocation] = useState('');

    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);
   
    if (!countries.length) {
        return (
            <Alert 
                center={ true }
                message={ `Actualmente solo disponible España para cotización.` }
            />
        );
    }

    const countriesFilter = findCountriesByName(countries, searchLocation);

    return (
        <div className="space-y-2">
            <label className="inline-block ml-3 mb-2 text-sm font-medium text-slate-700">
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

                    onFocus={ () => setShowDropdown(true) }
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
                    <Globe className="h-5 w-5" />
                </div>
            </div>
            { !isLoadingCountries && showDropdown && searchLocation.length > 0 && (
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
                    <div
                        ref={ dropdownRef }  
                        className="max-h-64 overflow-y-auto py-2"
                    >
                        { countriesFilter.length ? ( 
                            countriesFilter.map((item) => (
                                <button
                                    type="button"
                                    key={ item.countryCode }
                                    onClick={ () => {
                                        setSearchLocation(item.countryName);
                                        setValue("countryCode", item.countryCode);
                                        resetField('destinationPostalCode');
                                        setShowDropdown(false);
                                    }}

                                    className='
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
                                    '
                                >
                                    { item.countryName }
                                </button>
                            ))
                        ) : ( 
                            <div className='px-4 py-3 text-sm text-slate-500'>
                                No se encontraron países
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CountrySelector;