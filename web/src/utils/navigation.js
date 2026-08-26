
import {
    LayoutDashboard,
    MapPinned,
    Building2,
    Tags,
    Boxes,
    Users,
    ScrollText,
} from "lucide-react";

export const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, to: '/admin' },
    { label: "Zonas", icon: MapPinned, to: '/admin/zones' },
    { label: "Agencias", icon: Building2, to: '/admin/agencies/quick' },
    { label: "Tarifas", icon: Tags },
    { label: "Tipos de palet", icon: Boxes },
    { label: "Usuarios", icon: Users },
    { label: "Auditoría", icon: ScrollText },
];