
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
        provinces.length ? (
            <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-900 shadow-sm"> 
                <span className="mr-2 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-500"> 
                    <MapPin size={ 15 } />
                </span>

                <span className={ province?.name ? `font-medium tracking-[-0.01em]` : `text-xs text-slate-500`} >
                    { province?.name ?? 'Introduce código postal' }
                </span>
            </div>
        ) : (
            <DisplayLoading />
        )
    );
}

export default ProvinceDisplay;