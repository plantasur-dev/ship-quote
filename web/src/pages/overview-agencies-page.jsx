
import { Building2, Plus } from "lucide-react";
import { RouteButton } from "../components/ui"; 
import { LayoutAdminPage } from "../components/layouts";
import { AgenciesOverview } from "../components/ship-quote/admin";

function OverviewAgenciesPage() {

    const jumbotron = {
        icon: Building2,
        crumbs: ['Consola', 'Agencias'],
        title: 'Agencias',
        description: 'Activa o desactiva carriers y ajusta su suplemento de combustible.',
        actions: <RouteButton title={ 'Nueva' } to={'/admin/agencies/new'} icon={ Plus } />
    };
  
    return (
        <LayoutAdminPage jumbotron={ jumbotron } >
            <AgenciesOverview />
        </LayoutAdminPage>
    );
}

export default OverviewAgenciesPage;