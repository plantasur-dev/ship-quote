
import { useFormContext, useWatch } from "react-hook-form";

import { findProvinceByPostalCode } from "../../compare-rate-utils/compare-rate-utils";

function ProvinceDisplay({ provinces }) {

    const { control } = useFormContext();

    const watchCountry = useWatch({ control, name: "countryCode" });

    const postalCode = useWatch({ control, name: "destinationPostalCode" });
    
    const provincesFilter = findProvinceByPostalCode(provinces, postalCode);
    
    return (
        <> 
            { watchCountry === 'ES' && (
                <div>
                    <label className="text-sm text-slate-500">Provincia</label>
                    <input
                        value={ provincesFilter?.name || 'Desconocido' }
                        className="w-full mt-1 px-4 py-3 rounded-lg bg-white/60 border border-slate-200 opacity-60 disabled"
                        placeholder="Granada"
                        disabled
                    />
                </div>
            )}
        </>
    );
}

export default ProvinceDisplay;