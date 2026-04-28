
import { useState, useEffect } from "react";

import FormCompareRateSkeleton from '../skeleton-compare-rate/form-compare-rate-skeleton';

import DetailsItemsRate from '../details-items-rate/details-items-rate';

import { locationsCountries, locationsProvinces } from '../../../../services/api-services';

function FormCompareRate({ data, setData, handlerCalculateRates }) {

    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    
    const [searchLocation, setSearchLocation] = useState('');
    const [searchPostal, setSearchPostal] = useState('');

    const [item, setItem] = useState({});

    const [showDropdown, setShowDropdown] = useState(false);
    
    useEffect(() => {
        const fetchCountries = async () => {
            const countries = await locationsCountries();
            const langClient = navigator.language.split('-')[1];

            setCountries(countries?.[langClient] || countries?.['US']);
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        if (data.countryCode !== 'ES') return;

        const fetchProvinces = async () => {
            const provinces = await locationsProvinces();
            setProvinces(provinces);
        };

        fetchProvinces();
    }, [data.countryCode]);

    const handlerAddItem = () => {
        if (!item.large || !item.width || !item.height || !item.weight) return;

        setData(prev => ({
            ...prev,
            items: [...prev.items, item]
        }));

        setItem([]);
    }

    const handlerDeleteItem = (itemDelete) => {
        const items = data.items.filter(item => item !== itemDelete);

        setData(prev => ({
            ...prev,
            items
        }));
    }

    if (countries.length === 0) {
        return <FormCompareRateSkeleton />;
    }

    const filterCon = countries.filter(country => 
        country.countryName?.toLowerCase().includes(searchLocation?.toLowerCase()));
    
    const postalPrefix = searchPostal.slice(0, 2);
    const filterPro = provinces.find(province => 
        String(province?.postalCode) === postalPrefix);
    
    return (
        <>
            <div>
                <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
                    Calcula la cotización de envíos
                </h2>
                <p className="mt-4 text-slate-600 text-lg">
                    Compara tarifas de múltiples transportistas.
                    Cayco, Tecum, Dascher...
                </p>
            </div>

            <div className="backdrop-blur-xl bg-white/60 border border-white/70 shadow-xl rounded-2xl p-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-500">País</label>
                        <input
                            name="countryCode"
                            value={ searchLocation || '' }
                            onChange={(e) => {
                                setSearchLocation(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={ () => setShowDropdown(true) }
                            placeholder="España"
                            className="w-full mt-1 px-4 py-3 rounded-lg bg-white/70 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        { showDropdown && searchLocation.length > 0 && (
                            <div className="mt-2 bg-white border rounded-xl shadow max-h-60 overflow-y-auto">
                                { filterCon.map((item) => (
                                    <div
                                        key={ item.countryCode }
                                        onClick={() => {
                                            setSearchLocation(item.countryName);

                                            setData(prev => ({ 
                                                ...prev, 
                                                ...item 
                                            }));
                                            
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

                    <div>
                        <label className="text-sm text-slate-500">Código Postal</label>
                        <input
                            name="destinationPostalCode"
                            onInput={ (e) => {
                                const postalCode = e.target.value;
                                
                                setSearchPostal(postalCode);
                                
                                setData(prev => ({
                                    ...prev,
                                    province: filterPro?.adminFullCode,
                                    destinationPostalCode: postalCode
                                }));
                            }}
                            placeholder="28001"
                            className="w-full mt-1 px-4 py-3 rounded-lg bg-white/70 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    { data.countryCode === 'ES' && 
                        <div>
                            <label className="text-sm text-slate-500">Provincia</label>
                            <input
                                value={ filterPro?.name || 'Desconocido' }
                                name="provinceName"
                                disabled
                                placeholder="Granada"
                                className="w-full mt-1 px-4 py-3 rounded-lg bg-white/60 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 opacity-60 disabled"
                            />
                        </div>
                    }

                    <div>
                        <label className="text-sm text-slate-500">Tipo servicio</label>
                         <select
                            value={ item?.type || ''}

                            onChange={(e) => {
                                const value = e.target.value;

                                setItem(prev => ({
                                    ...prev,
                                    type: value
                                }));
                            }}

                            className="w-full mt-1 px-4 py-3 rounded-lg bg-white/70 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="pallet">Pallet</option>
                            <option value="parcel">Paqueteria</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500">Dimensiones (cm) y Peso (Kg)</label>
                        <div className="flex gap-2 mt-1">
                            <input name="large" 
                                type="number" 
                                placeholder="Largo"
                                value={ item?.large || '' } 
                                onChange={(e) => setItem(prev => ({ ...prev, large: e.target.value }))} 
                                className="w-full px-3 py-3 rounded-lg bg-white/70 border border-slate-200" 
                            />
                            <input name="width" 
                                type="number" 
                                placeholder="Ancho" 
                                value={ item?.width || '' } 
                                onChange={(e) => setItem(prev => ({ ...prev, width: e.target.value }))} 
                                className="w-full px-3 py-3 rounded-lg bg-white/70 border border-slate-200" 
                            />
                            <input name="height" 
                                type="number" 
                                placeholder="Alto"
                                value={ item?.height || '' }  
                                onChange={(e) => setItem(prev => ({ ...prev, height: e.target.value }))} 
                                className="w-full px-3 py-3 rounded-lg bg-white/70 border border-slate-200" 
                            />
                            <input name="weight" 
                                type="number" 
                                placeholder="Peso"
                                value={ item?.weight || '' }  
                                onChange={(e) => setItem(prev => ({ ...prev, weight: e.target.value }))} 
                                className="w-full px-3 py-3 rounded-lg bg-white/70 border border-slate-200" 
                            />
                        </div>
                    
                        <button 
                            onClick={ handlerAddItem }

                            disabled={( 
                                !searchPostal ||
                                !item.large || 
                                !item.width || 
                                !item.height || 
                                !item.weight 
                            )}

                            className={`py-3 
                                text-indigo-400 
                                text-sm 
                                font-medium 
                                transition
                                enabled:hover:text-indigo-800
                                enabled:cursor-pointer
                                disabled:text-indigo-200
                                disabled:cursor-not-allowed"
                            `}>
                            Añadir
                        </button>
                    </div>

                    <DetailsItemsRate 
                        items={ data.items } 
                        onRemove={ handlerDeleteItem }
                    />

                    <button 
                        onClick={ handlerCalculateRates }
                        disabled={ !data.items.length }
                        className={`w-full 
                            py-3 
                            rounded-xl 
                            bg-indigo-600 
                            text-white 
                            font-semibold 
                            hover:bg-indigo-700 
                            transition 
                            cursor-pointer
                            ${ !data.items.length 
                                ? 'disabled:bg-indigo-400' 
                                : '' 
                            }
                        `}>
                        Obtener cotización
                    </button>
                </div>
            </div>
        </>
    );
}

export default FormCompareRate;