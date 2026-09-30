
import { PackageOpen } from "lucide-react";
import { EmptyState } from "../../../../ui";
import AuditItem from "../audit-item/audit-item";


function AuditList ({ activities, isLoading }) {
    
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
                    </div> ))}
            </div> 
        )
    }

    if (!activities?.meta?.hasRecords) {
        return (
            <EmptyState 
                icon={ PackageOpen } 
                description={ 'No existe aún actividad registrada' }
            />
        );
    }


    return (
        <div className="flex flex-col rounded-2xl border border-panel-border bg-panel p-5 mb-6">
            <div className="mb-1 flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold text-text-primary">
                    Actividad
                </h2>
            </div>

            <div className="mt-3">
                { activities.data.map((activity) => (
                        <AuditItem 
                            key={ activity.id } 
                            activity={ activity }
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default AuditList;