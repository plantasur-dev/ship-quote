
import { Wifi, WifiOff } from "lucide-react";

function AgencyStatusRow({ name, type, status }) {
    const isOnline = status === "online";

    return (
        <div className="flex items-center justify-between border-b border-panel-border py-3 last:border-0">
            <div className="flex items-center gap-2.5">
                {isOnline ? (
                    <Wifi size={ 14 } className="text-accent" />
                ) : (
                    <WifiOff size={ 14 } className="text-danger" />
                )}
                <div>
                    <p className="text-sm text-text-primary">{ name }</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                        {type}
                    </p>
                </div>
            </div>
            <span
                className={[
                    "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                    isOnline ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger",
                ].join(" ")}
            >
                {isOnline ? "Operativa" : "Sin respuesta"}
            </span>
        </div>
    );
}

const AGENCIES = [
    { name: "Dachser", type: "API", status: "online" },
    { name: "Rhenus", type: "Estática", status: "online" },
    { name: "Cayco", type: "Estática", status: "online" },
    { name: "Tecum", type: "Híbrida", status: "offline" },
];

function StateAgencies() {

    return (
        <div className="rounded-2xl border border-panel-border bg-panel p-5">
            <h2 className="mb-1 font-display text-sm font-semibold text-text-primary">
                Estado de agencias
            </h2>
            <p className="mb-3 text-xs text-text-muted">
                Conectividad de carriers en tiempo real
            </p>
            <div>
                { AGENCIES.map((agency) => (
                    <AgencyStatusRow key={ agency.name } { ...agency } />
                ))}
            </div>
        </div>
    );
}

export default StateAgencies;