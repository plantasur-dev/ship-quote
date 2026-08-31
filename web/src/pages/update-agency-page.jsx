
import { Building2, Undo2 } from "lucide-react";
import { RouteButton } from "../components/ui";
import { LayoutAdminPage } from "../components/layouts";
import AgencyFormContainer from "../components/ship-quote/admin/agencies/agency-form/agency-form-container";

function UpdateAgencyPage() {

    const jumbotron = {
        icon: Building2,
        crumbs: ["Consola", "Agencias", "Actualizar"],
        title: 'Actualizar agencia',
        description: 'Visualiza tú carrier y configura sus reglas de cotización.',
        actions: <RouteButton title={ 'Atrás' } to={ -1 } icon={ Undo2 } />
    };

    return (
        <LayoutAdminPage jumbotron={ jumbotron }>
            <AgencyFormContainer mode={ 'edit' }/>
        </LayoutAdminPage>
    );

}

export default UpdateAgencyPage;