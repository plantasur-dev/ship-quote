
import { LayoutDashboard } from "lucide-react";
import { LayoutAdminPage } from "../components/layouts";
import { Stats, StateAgencies, Activity } from "../components/ship-quote/admin";

export default function DashboardAdmin() {

    const jumbotron = {
        icon: LayoutDashboard,
        crumbs: ['Consola', 'Dashboard'],
        title: 'Panel de operaciones',
        description: 'Resumen general de zonas, agencias y tarifas activas en el sistema.'
    };

    return (
        <LayoutAdminPage jumbotron={ jumbotron } >
            <Stats />

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
                <Activity />
                <StateAgencies />
            </section>
            
        </LayoutAdminPage>
    );
}