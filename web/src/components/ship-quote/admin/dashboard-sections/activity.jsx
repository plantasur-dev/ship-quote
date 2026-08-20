
import { useEffect, useState } from "react";

function useLiveClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(id);
    }, []);

    return now;
}


function formatDay(date) {
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

function ActivityRow({ time, user, action, target }) {
    return (
        <div className="flex items-center gap-4 border-b border-panel-border py-3 text-sm last:border-0">
            <span className="w-12 shrink-0 font-mono text-[11px] text-text-muted">{time}</span>
            <span className="w-24 shrink-0 truncate text-text-muted">{user}</span>
            <span className="flex-1 text-text-primary">
                {action} <span className="text-accent">{target}</span>
            </span>
        </div>
    );
}

const ACTIVITY = [
    { time: "14:22", user: "M. Otero", action: "Actualizó tarifa", target: "Germany-ZONA-01" },
    { time: "13:58", user: "A. Reboiro", action: "Creó zona", target: "Italy-ZONA-04" },
    { time: "12:41", user: "sistema", action: "Refrescó caché", target: "agencyTariffs" },
    { time: "11:15", user: "M. Otero", action: "Desactivó agencia", target: "Tecum" },
    { time: "09:30", user: "A. Reboiro", action: "Creó tipo de palet", target: "Media europalet" },
];

function Activity() {
    
    const now = useLiveClock();

    return (
        <div className="rounded-2xl border border-panel-border bg-panel p-5">
            <div className="mb-1 flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold text-text-primary">
                    Actividad reciente
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    hoy · {formatDay(now)}
                </span>
            </div>
            <div className="mt-3">
                {ACTIVITY.map((entry, i) => (
                    <ActivityRow key={i} {...entry} />
                ))}
            </div>
        </div>
    );
}

export default Activity;