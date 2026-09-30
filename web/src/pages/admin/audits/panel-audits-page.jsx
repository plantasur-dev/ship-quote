
import { ScrollText } from "lucide-react";
import { LayoutAdminPage } from "../../../components/layouts";
import { AuditSearch } from "../../../components/ship-quote/admin";

function PanelAuditsPage () {

    const jumbotron = {
        icon: ScrollText,
        crumbs: ['Consola', 'Auditoría'],
        title: 'Auditoría',
        description: 'Consulta las últimas actividades y sus detalles.',
    };

    return (
        <LayoutAdminPage jumbotron={ jumbotron } >
            <AuditSearch />
        </LayoutAdminPage>
    );
}

export default PanelAuditsPage;