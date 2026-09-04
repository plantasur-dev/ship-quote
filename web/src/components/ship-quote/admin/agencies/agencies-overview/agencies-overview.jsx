
import { FolderSearch } from "lucide-react";
import AgencyCard from "../agency-card/agency-card";
import { useAgencies } from "../../../../../hooks";

function AgenciesOverview() {
 
    const { 
        isLoadingAgencies, 
        agencies, 
        handleUpdateStateAgency, 
        handleUpdateFuelSurcharge 
    } = useAgencies();
    
    if (isLoadingAgencies) {
        return (
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                { Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded border border-panel-border p-4"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="h-3 w-28 animate-pulse rounded bg-panel-border" />
                            <div className="h-3 w-16 animate-pulse rounded bg-panel-border" />
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="h-3 w-3/4 animate-pulse rounded bg-panel-border" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-panel-border" />
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <div className="h-3 w-24 animate-pulse rounded bg-panel-border" />
                            <div className="h-3 w-12 animate-pulse rounded bg-panel-border" />
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    if (!agencies.length) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <span className="flex items-center text-accent gap-2"> 
                    <FolderSearch />No existen agencias
                </span>
            </div>
        );
    }

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">            
            {   agencies.map((agency) => (
                    <AgencyCard
                        key={ agency.id }
                        agency={ agency }
                        onToggleActive={ handleUpdateStateAgency }
                        onUpdateFuel={ handleUpdateFuelSurcharge }
                    />
            ))}
        </section>
    );
}

export default AgenciesOverview;