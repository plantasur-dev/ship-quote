
import { FolderSearch } from "lucide-react";
import { RouteSpinner } from "../../../../ui/loaders/loader";
import { useAudits } from "../../../../../hooks";
import { useLiveClock, formatDay, formatClock } from "../../../../../utils";

function ActivityRow({ createdAt, userId, action, resource, ip, input = {} }) {
    const timeFormated = formatClock(new Date(createdAt));

    const actionFormated = action[0].toUpperCase() + action.slice(1).toLowerCase();

    const { countryCode, destinationPostalCode } = input;

    return (
        <div className="flex items-center gap-4 border-b border-panel-border py-3 text-sm last:border-0">
            <span className="w-22 shrink-0 font-mono text-[11px] text-text-muted">{ timeFormated }</span>
            <span className="w-24 shrink-0 truncate text-text-muted">
                { userId && userId?.username[0].toUpperCase() + userId?.username.slice(1).toLowerCase() } { ip }
            </span>
            <span className="flex-1 text-text-primary">

                <span className={`font-mono text-[12px] tracking-wider
                    ${ input && countryCode === 'ES' 
                        ? 'text-green-300' 
                        : 'text-warning-soft'}`
                    }
                >{ input && 
                    countryCode 
                        ? `Consulta ${ countryCode } ${ destinationPostalCode }` 
                        : <span className="text-danger">Consola interna</span> }
                </span> · Operación { actionFormated } <span className="text-accent">{ resource }</span>
            </span>
        </div>
    );
}

function Activity() {

    const now = useLiveClock();

    const { activities, isLoading } = useAudits();

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-panel-border bg-panel p-5">
                <div className="flex items-center justify-center py-10">
                    <RouteSpinner size={ 45 } />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col rounded-2xl border border-panel-border bg-panel p-5">
            <div className="mb-1 flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold text-text-primary">
                    Actividad reciente
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    hoy · { formatDay(now) }
                </span>
            </div>

            <div className="mt-3">

                { !activities.length && 
                    <span className="flex items-center justify-center py-10 text-sm text-accent gap-2">
                        <FolderSearch size={ 16 } /> Sin actividad
                    </span>
                }

                { activities.map((activity) => (
                        <ActivityRow 
                            key={ activity._id } 
                            { ...activity } 
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Activity;