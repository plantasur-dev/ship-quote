
import { Map } from "lucide-react";

import { useFormContext, useWatch } from "react-hook-form";

function CountryDisplay({ countries }) {

    const { control } = useFormContext();

    const countryCode = useWatch({ control, name: 'countryCode' });
    
    const countrySelect = countries.find(
        country => country.countryCode === countryCode
    );

    return (
        <div className="space-y-2">
            <label className="inline-block ml-3 mb-2 text-sm font-medium text-slate-700">
                País
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
                    <Map size={ 16 } />
                </span>

                { countrySelect?.countryName ?? 'España' }
            </div>
        </div>
    );

}

export default CountryDisplay;