
import { Globe2, MapPin } from "lucide-react";
import { useProvince } from "../../../hooks"; 

function Province({ countryCode, codePostal, className= '' }) {
 
    const { province, isLoadingProvince } = useProvince({ countryCode, codePostal });
 
    const isDomestic = countryCode === 'ES';
 
    if (isLoadingProvince) {
        return (
            <div className="mb-3 flex items-center gap-2">
                <div className="h-7 w-44 animate-pulse rounded-full bg-panel-border" />
                <div className="h-7 w-28 animate-pulse rounded-full bg-panel-border" />
            </div>
        );
    }
 
    return (
        <div className={ `flex flex-wrap items-center gap-2 ${ className }` }>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium
                ${ isDomestic
                    ? 'border-green-300/25 bg-green-300/10 text-green-300'
                    : 'border-info/25 bg-info/10 text-info' }`
                }
            >
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="font-mono tracking-wide">{ countryCode } { codePostal }</span>
 
                { province?.name && (
                    <>
                        <span className="opacity-30">·</span>
                        <span className="font-normal opacity-80">
                            { province.name }
                            { province.countryName ? `, ${ province.countryName }` : '' }
                        </span>
                    </>
                ) }
            </span>
 
            <span className="inline-flex items-center gap-1.5 rounded-full border border-panel-border px-2.5 py-1 text-[11px] font-medium text-text-muted">
                <Globe2 className="h-3 w-3" />
                { isDomestic ? 'Nacional' : 'Internacional' }
            </span>
        </div>
    );
}

export default Province;