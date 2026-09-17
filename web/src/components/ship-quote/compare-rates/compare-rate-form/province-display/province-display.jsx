
import { MapPin } from "lucide-react";

import DisplayLoading from "../../../../entities/comparator/input-display-loading";

import { 
    countryExists, 
    findProvinceByPostalCode 
} from "../../utils/compare-rate-utils";

function ProvinceDisplay({ provinces = [], postalCode, countryCode }) {
   
    const isCountryExists = countryExists(provinces, countryCode);

    if (!isCountryExists) return <></>;
    
    const province = findProvinceByPostalCode(provinces, countryCode, postalCode);

    return (
        <div className="space-y-2">
            <label className="inline-block ml-3 mb-2 text-sm font-medium text-slate-700">
                Provincia
            </label>

            { provinces.length ? (
                <div
                    className="
                        flex
                        h-12
                        items-center
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/80
                        px-4
                        text-sm
                        text-slate-700
                        shadow-sm
                    "
                >
                    <span className="mr-2 opacity-70">
                        <MapPin size={ 16 } />
                    </span>

                    { province?.name || 'Desconocida' }
                </div>
            ) : (
                <DisplayLoading />
            )}       
        </div>
    );
}

export default ProvinceDisplay;