
import { Inbox } from "lucide-react";
import { EmptyState, ErrorState, InputFinder } from "../../../../ui";
import AuditItem from "../audit-item/audit-item";
import { useAuditFilters, useAudits, usePolling } from "../../../../../hooks";
import { TIMER_ACTIVITY } from "../../../../../utils";
import { useState } from "react";


function AuditList () {

    const {
        filters,
    } = useAuditFilters({ limit: 40, action: 'TARIFF_SEARCH' });
    
    const { activities, isLoading, refetch, error } = useAudits({ filters });

    const [search, setSearch] = useState(activities);

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

    if (error !== null) {
        return <ErrorState variant={ error.status } />;
    }

    if (!activities.length) {
        return <EmptyState 
            icon={ Inbox } 
            description={ 'No existe aún actividad registrada' }
        />
    }

    return (
        <div className="flex h-full flex-col rounded-2xl border border-panel-border bg-panel p-5">
            <div className="mb-1 flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold text-text-primary">
                    Actividad
                </h2>

                <InputFinder onChange={ setSearch } />
            </div>

            <div className="mt-3">
                { activities
                    ?.filter((activity) => 
                        activity.input.destinationPostalCode.includes(search)
                    ).map((activity) => (
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