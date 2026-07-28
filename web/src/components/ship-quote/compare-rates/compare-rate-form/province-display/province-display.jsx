
import ProvinceLoading from "./province-loading";

import { 
    countryExists, 
    findProvinceByPostalCode 
} from "../../utils/compare-rate-utils";

function ProvinceDisplay({ provinces = [], postalCode, countryCode }) {
   
    if (!provinces.length) return <ProvinceLoading />;

    const isCountryExists = countryExists(provinces, countryCode);
    
    const province = findProvinceByPostalCode(provinces, countryCode, postalCode);

    return (
        <>
            { isCountryExists && (
                <div className="space-y-2">

                    <label className="text-sm font-medium text-slate-700">
                        Provincia
                    </label>

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
                            📍
                        </span>

                        { province?.name || 'Desconocido' }
                    </div>
                </div>
            )}
        </>
    );
}

export default ProvinceDisplay;