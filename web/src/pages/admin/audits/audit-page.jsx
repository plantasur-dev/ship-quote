
import { ScrollText, Undo2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { LayoutAdminPage } from "../../../components/layouts";
import { RouteButton } from "../../../components/ui";
import { AuditDetails } from "../../../components/ship-quote/admin";

function AuditPage () {

    const jumbotron = {
        icon: ScrollText,
        crumbs: ['Consola', 'Auditoría'],
        title: 'Auditoría',
        description: 'Consulta las últimas actividades y sus detalles.',
        actions: <RouteButton title={ 'Atrás' } to={ -1 } icon={ Undo2 } />
    };

    const { activityId } = useParams();

    return (
        <LayoutAdminPage jumbotron={ jumbotron } >
            <AuditDetails activityId={ activityId }/>
        </LayoutAdminPage>
    );
}

export default AuditPage;