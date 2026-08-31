
import { Wifi, WifiOff, Fuel, Euro, Percent, FolderSearch } from "lucide-react";
import { useAgencies } from "../../../../../hooks";
import { RouteSpinner } from "../../../../ui/loaders/loader";

function AgencyStatusRow({ name, type, active, supplements }) {
    const isOnline = active === true;

    const { enabled, type: typeOperation, value } = supplements?.fuelSurcharge;

    return (
        <div className="flex items-center justify-between border-b border-panel-border py-3 last:border-0">
            <div className="flex items-center gap-2.5">
                { isOnline ? (
                    <Wifi size={ 14 } className="text-accent" />
                ) : (
                    <WifiOff size={ 14 } className="text-danger" />
                )}
                <div>
                    <p className="text-sm text-text-primary">{ name }</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                        { type }
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <span className={`font-mono text-[10px] tracking-wider 
                    ${ isOnline 
                        ? 'text-accent' 
                        : 'text-danger'}`
                    }
                >
                    { enabled && (
                        <div className="flex items-center gap-0.5">
                            <Fuel
                                size={ 12 }
                                className="w-4 shrink-0 text-muted-foreground"
                            />

                            <span className="text-[12px]">{ value }</span>

                            { type === 'fixed' ? (
                                <Euro size={10} />
                            ) : (
                                <Percent size={10} />
                            )}
                        </div>
                    )}
                </span>
                <span
                    className={[
                        "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                        isOnline ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger",
                    ].join(" ")}
                >
                    { isOnline ? "Activa" : "Desactivada" }
                </span>
            </div>
        </div>
    );
}

function StateAgencies() {

    const { agencies, isLoadingAgencies } = useAgencies();

    if (isLoadingAgencies) {
        return (
            <div className="rounded-2xl border border-panel-border bg-panel p-5">
                <div className="flex items-center justify-center py-10">
                    <RouteSpinner size={45} />
                </div>
            </div>
        );
    }

    const totalAgencies = agencies.length;

    const visibleAgencies = agencies.toSorted((a, b) =>(
        Number(b.active) - Number(a.active) ||
        a.type.localeCompare(b.type)
    )).slice(0, 6)

    return ( 
        <div className="rounded-2xl border border-panel-border bg-panel p-5">
            <h2 className="mb-1 font-display text-sm font-semibold text-text-primary">
                Estado de agencias
            </h2>
            <p className="mb-3 text-xs text-text-muted">
                Conectividad de carriers en tiempo real
            </p>
            <div>

                { !totalAgencies && 
                    <span className="flex items-center justify-center py-10 text-accent gap-2">
                        <FolderSearch /> Agencias no encontradas
                    </span>
                }

                { visibleAgencies.map((agency) => (
                        <AgencyStatusRow key={ agency.name } { ...agency } />
                    ))
                }

            </div>
            <div>
                { (totalAgencies > visibleAgencies.length) && 
                    (<p className="font-mono text-[10px] tracking-wider text-accent">
                        +{ totalAgencies - visibleAgencies.length } más
                    </p>)
                }
            </div>
        </div>
    );
}

export default StateAgencies;