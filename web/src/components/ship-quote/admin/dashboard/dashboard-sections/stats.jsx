
import { 
    ArrowDownRight, 
    ArrowUpRight, 
    Building2, 
    MapPinned, 
    Tags, 
    Users 
} from "lucide-react";

function StatCard({ label, value, delta, trend, icon: Icon }) {
    const isUp = trend === "up";
    const isDown = trend === "down";

    return (
        <div className="rounded-2xl border border-panel-border bg-panel p-5">
            <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                    { label }
                </span>
                <Icon size={ 15 } className="text-text-muted" />
            </div>
            <div className="mt-3 flex items-end justify-between">
                <span className="font-display text-3xl font-semibold text-text-primary">
                    {value}
                </span>
                <span
                    className={[
                        "flex items-center gap-0.5 font-mono text-xs",
                        isUp && "text-accent",
                        isDown && "text-danger",
                        !isUp && !isDown && "text-text-muted",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    { isUp && <ArrowUpRight size={ 13 } /> }
                    { isDown && <ArrowDownRight size={ 13 } /> }
                    { delta }
                </span>
            </div>
        </div>
    );
}

const STATS = [
    { label: "Zonas activas", value: "184", delta: "+6", trend: "up", icon: MapPinned },
    { label: "Agencias", value: "7", delta: "0", trend: "flat", icon: Building2 },
    { label: "Tarifas cargadas", value: "2.340", delta: "+112", trend: "up", icon: Tags },
    { label: "Sesiones activas", value: "3", delta: "-1", trend: "down", icon: Users },
];


function Stats() {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            { STATS.map((stat) => (
                <StatCard key={ stat.label } { ...stat } />
            ))}
        </section>
    );
}

export default Stats;