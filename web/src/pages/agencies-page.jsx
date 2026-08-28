
import { Building2, Plus, Undo2 } from "lucide-react";
import { RouteButton } from "../components/ui";
import { LayoutAdminPage } from "../components/layouts";
import { agenciesConfig } from "../components/ship-quote/admin/agencies/agency-config";
import ItemsList from "../components/ship-quote/admin/items-list.jsx/items-list";
import { useAgencies } from "../hooks";

function AgenciesPage() {

    const jumbotron = {
        icon: Building2,
        crumbs: ['Consola', 'Agencias'],
        title: 'Agencias',
        description: 'Listado de carriers y ajusta su suplemento de combustible.',
        actions: <>
            <RouteButton title={ 'Nueva' } to={'/admin/agencies/new'} icon={ Plus } />
            <RouteButton title={ 'Atrás' } to={ -1 } icon={ Undo2 } />
        </>
    };

    const { isLoadingAgencies, agencies } = useAgencies();

    if (isLoadingAgencies) return;
  
    return (
        <LayoutAdminPage jumbotron={ jumbotron } >
            <ItemsList 
                items={ agencies } 
                config={ agenciesConfig }
            />
        </LayoutAdminPage>
    );
}

export default AgenciesPage;