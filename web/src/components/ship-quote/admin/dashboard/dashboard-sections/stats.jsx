
import { 
    ArrowDownRight, 
    ArrowUpRight, 
    Building2, 
    ChartColumn, 
    MapPinned, 
    Tags, 
    Users 
} from "lucide-react";
import { useState, useEffect } from "react";
import { RouteSpinner } from "../../../../ui/loaders/loader";
import { getStatsAudit, getMostCodePostalAudit } from "../../../../../services/api-service";

const STATS = [
    {
        label: "Consultas de tarifas",
        getValue: (stats) => stats.tariffSearchOfToday,
        getDelta: (stats) =>
            stats.tariffSearchOfToday - stats.tariffSearchOfYesterday,
        icon: Tags,
    },
    {
        label: "Agencias",
        getValue: (stats) => stats.countAgencies,
        getDelta: () => 0,
        icon: Building2,
    },
    {
        label: "C.Postal más consultado",
        getValue: (stats) => stats.codePostal,
        getDelta: (stats) => stats.total,
        icon: MapPinned,
    },
    {
        label: "Sesiones activas",
        getValue: (stats) => stats.activeOfTodaySession,
        getDelta: (stats) =>
            (stats?.activeOfTodaySession - stats?.activeOfYesterdaySession),
        icon: Users,
    }
];

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

function Stats() {

    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        setIsLoading(true);

        const fetchStats = async () => {
            try {
                const [stats, mostConsultedZone] = await Promise.all([
                    getStatsAudit(),
                    getMostCodePostalAudit(),
                ]);

                setStats({
                    ...stats, 
                    codePostal: Number(mostConsultedZone[0]._id), 
                    total: mostConsultedZone[0].total
                });
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();        
    }, []);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-panel-border bg-panel p-5">
                <div className="flex items-center justify-center py-10">
                    <RouteSpinner size={ 45 } />
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="rounded-2xl border border-panel-border bg-panel p-5">
                <div className="flex items-center justify-center py-10 text-sm text-accent gap-1">
                    <ChartColumn size={ 16 }/>
                    Sin estadísticas
                </div>
            </div>
        );
    }
   
    return (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            { STATS.map((stat) => {
                const value = stat.getValue(stats);
                const delta = stat.getDelta(stats);

                return (
                    <StatCard
                        key={ stat.label }
                        label={ stat.label }
                        value={ value }
                        delta={ delta > 0 ? `+${ delta }` : `${ delta }`}
                        trend={
                            delta > 0
                                ? "up"
                                : delta < 0
                                    ? "down"
                                    : "flat"
                        }
                        icon={ stat.icon }
                    />
                );
            })}
        </section>
    );
}

export default Stats;