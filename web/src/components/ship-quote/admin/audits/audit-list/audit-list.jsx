
import { Inbox } from "lucide-react";
import AuditItem from "../audit-item/audit-item";
import { useAuditFilters, useAudits, usePolling } from "../../../../../hooks";
import { TIMER_ACTIVITY } from "../../../../../utils";

function AuditList () {

    const {
        filters
    } = useAuditFilters();

    const { activities, isLoading, refetch } = useAudits({ filters });

    filters.limit = 40;
    filters.action = 'TARIFF_SEARCH';

    usePolling(refetch, TIMER_ACTIVITY);

    if (isLoading) {
        return (
            <div className="flex flex-col">
                { Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={ i }
                        className="flex items-center gap-4 border-b border-panel-border py-3 last:border-0"
                    >
                        <div className="h-3 w-16 animate-pulse rounded bg-panel-border" />
                        <div className="h-3 w-24 animate-pulse rounded bg-panel-border" />
                        <div className="h-3 flex-1 animate-pulse rounded bg-panel-border" />
                    </div>
                )) }
            </div>
        );
    }

    if (!activities.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-text-muted">
                <Inbox className="h-6 w-6" />
                <p className="text-sm">No hay actividad registrada en este rango</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col rounded-2xl border border-panel-border bg-panel p-5">
            <div className="mb-1 flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold text-text-primary">
                    Actividad
                </h2>
            </div>

            <div className="mt-3">
                { activities.map((activity) => (
                        <AuditItem 
                            key={ activity._id } 
                            activity={ activity }
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default AuditList;