
import { useEffect, useState } from "react";
import { useLiveClock, formatDay, formatClock } from "../../../../utils";
import { listAudit } from "../../../../services/api-service";
import { RouteSpinner } from "../../../ui/loaders/loader";
import { FolderSearch } from "lucide-react";

function ActivityRow({ createdAt, statusCode, userId, action, endpoint, metadata }) {
    const timeFormated = formatClock(new Date(createdAt));

    const actionFormated = action[0].toUpperCase() + action.slice(1).toLowerCase();

    const endpointFormated = endpoint.replace('/api/v1/', '');

    const { ip } = metadata;

    const isSuccess = statusCode === 200;

    return (
        <div className="flex items-center gap-4 border-b border-panel-border py-3 text-sm last:border-0">
            <span className="w-25 shrink-0 font-mono text-[11px] text-text-muted">{ timeFormated }</span>
            <span className="w-24 shrink-0 truncate text-text-muted">{ userId && userId?.username } { ip }</span>
            <span className="flex-1 text-text-primary">

                <span className={`font-mono text-[12px] tracking-wider 
                    ${ isSuccess 
                        ? 'text-green-300' 
                        : 'text-danger'}`
                    }
                >{ statusCode }</span> · { actionFormated } <span className="text-accent">{ endpointFormated }</span>
            </span>
        </div>
    );
}

function Activity() {

    const [activity, setActivity] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const now = useLiveClock();

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                const activity = await listAudit({ page: 1, limit: 9 });
                setActivity(activity.data);
            } catch (error) {
                setError({
                    type: 'error',
                    message: error?.message || 'Error cargando actividad'
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchAudit();
    }, []);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-panel-border bg-panel p-5">
                <div className="flex items-center justify-center py-10">
                    <RouteSpinner size={45} />
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

                { !activity.length && 
                    <span className="flex items-center justify-center py-10 text-accent gap-2">
                        <FolderSearch /> Sin actividad
                    </span>
                }

                { activity && 
                    activity.map((entry, i) => (
                        <ActivityRow key={i} {...entry} />
                    ))
                }

            </div>
        </div>
    );
}

export default Activity;