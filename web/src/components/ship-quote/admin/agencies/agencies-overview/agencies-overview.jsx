
import { FolderSearch } from "lucide-react";
import { useAgencies } from "../../../../../hooks";
import { RouteSpinner } from "../../../../ui/loaders/loader";
import AgencyCard from "../agency-card/agency-card";

function AgenciesOverview() {
 
    const { 
        isLoadingAgencies, 
        agencies, 
        handleUpdateStateAgency, 
        handleUpdateFuelSurcharge 
    } = useAgencies();
    
    if (isLoadingAgencies) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <RouteSpinner size={ 45 } />
            </div>
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
            { agencies &&  
                agencies.map((agency) => (
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