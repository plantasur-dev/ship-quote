
import { useFormContext, useWatch } from "react-hook-form";

import { findProvinceByPostalCode } from "../../utils/compare-rate-utils";

function ProvinceDisplay({ provinces }) {

    const { control } = useFormContext();

    const watchCountry = useWatch({ control, name: "countryCode" });

    const postalCode = useWatch({ control, name: "destinationPostalCode" });
    
    const provincesFilter = findProvinceByPostalCode(provinces, postalCode);
    
    return (
    <>
        { watchCountry === 'ES' && (
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

                    { provincesFilter?.name || 'Desconocido' }
                </div>
            </div>
        )}
    </>
);
}

export default ProvinceDisplay;