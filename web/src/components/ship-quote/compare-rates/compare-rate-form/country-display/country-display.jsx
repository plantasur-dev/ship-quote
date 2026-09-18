
import { Map } from "lucide-react";

import { useFormContext, useWatch } from "react-hook-form";

function CountryDisplay({ countries }) {

    const { control } = useFormContext();

    const countryCode = useWatch({ control, name: 'countryCode' });
    
    const countrySelect = countries.find(
        country => country.countryCode === countryCode
    );

    return (
        <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm">
            <span className="mr-2 flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                <Map size={ 15 } /> 
            </span>
            
            <span className="font-medium tracking-[-0.01em]">
                { countrySelect?.countryName ?? 'España' }
            </span>
        </div>
    );
}

export default CountryDisplay;