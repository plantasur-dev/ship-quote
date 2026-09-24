
import { Globe } from "lucide-react";
import { inputStyle } from "../item-draft-form/item-draft-form-styles";
import { Alert } from '.././../../../ui';

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

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
        <div>
            <label className="inline-block ml-2 mb-2 text-sm font-medium text-slate-700">
                País destino
            </label>

            <div className="relative">
                
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Globe size={ 18 } />
                </div>

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
                    className={` 
                        ${ inputStyle }

                        pl-11
                                                
                        border-slate-200

                        hover:border-slate-300 
                    `}
                />

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