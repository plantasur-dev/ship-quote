
import { ScrollText } from "lucide-react";
import { LayoutAdminPage } from "../../../components/layouts";
import { AuditList } from "../../../components/ship-quote/admin";

function PanelAuditsPage () {

    const jumbotron = {
        icon: ScrollText,
        crumbs: ['Consola', 'Auditoría'],
        title: 'Auditoría',
        description: 'Consulta las últimas actividades y sus detalles.',
    };

    return (
        <LayoutAdminPage jumbotron={ jumbotron } >
            <AuditList />
        </LayoutAdminPage>
    );
}

export default PanelAuditsPage;