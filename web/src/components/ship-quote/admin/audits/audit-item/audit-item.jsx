
import { Package, ListChecks, ChevronRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import { formatClock, NAV_ITEMS } from "../../../../../utils";
import { Province } from "../../../../entities/shipping";

function AuditItem({ activity }) {

    const { id: activityId, createdAt, userId, response, ip, input = {} } = activity;

    const timeFormated = formatClock(new Date(createdAt));

    const { countryCode, destinationPostalCode, countryName, provinceName, items = [] } = input;

    const responseCount = response ? Object.keys(response).length : 0;
    const itemsCount = items?.length ?? 0;

    const initial = userId?.username?.[0]?.toUpperCase();
    
    return (
        <Link
            type="button"
            to={ `${ NAV_ITEMS[6].to }/${ activityId }` }
            className="group flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border-b border-panel-border px-2 py-3 text-left text-sm transition-colors last:border-0 hover:bg-panel-border/40 cursor-pointer sm:flex-nowrap"
        >
            <span className="order-1 shrink-0 font-mono text-[11px] text-text-muted ">
                { timeFormated }
            </span>

            <span className="order-2 flex shrink-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel-border text-[10px] font-semibold text-text-primary">
                    { initial ?? <User className="h-3 w-3 text-text-muted" /> }
                </span>
                <span className="truncate text-[12px] text-text-muted">
                    { userId?.username ?? ip }
                </span>
            </span>

            <ChevronRight className="order-3 ml-auto h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary sm:order-4 sm:ml-0" />

            <span className="order-4 flex flex-wrap items-center gap-2 sm:order-3 sm:flex-1">
                
                <Province 
                    countryCode={ countryCode }
                    countryName={ countryName }
                    provinceName={ provinceName }
                    codePostal={ destinationPostalCode }
                />

                <span className="inline-flex items-center gap-1 rounded-full border border-panel-border px-2 py-0.5 text-[11px] text-text-muted">
                    <Package className="h-3 w-3" />
                    { itemsCount } { itemsCount === 1 ? 'bulto' : 'bultos' }
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-panel-border px-2 py-0.5 text-[11px] text-text-muted">
                    <ListChecks className="h-3 w-3" />
                    { responseCount } { responseCount === 1 ? 'resultado' : 'resultados' }
                </span>
            </span>
        </Link>
    );
}

export default AuditItem;