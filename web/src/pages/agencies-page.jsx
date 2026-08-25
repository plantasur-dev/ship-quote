
import { Building2 } from "lucide-react";
import { LayoutAdminPage } from "../components/layouts";
import { AgenciesList } from "../components/ship-quote/admin";

function AgenciesPage() {
    const jumbotron = {
        icon: Building2,
        crumbs: ['Consola', 'Agencias'],
        title: 'Agencias',
        description: 'Activa o desactiva carriers y ajusta su suplemento de combustible.'
    };
  
    return (
        <LayoutAdminPage jumbotron={ jumbotron } >
            <AgenciesList />            
        </LayoutAdminPage>
    );
}

export default AgenciesPage;