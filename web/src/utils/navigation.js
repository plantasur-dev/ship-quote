
import {
    LayoutDashboard,
    MapPinned,
    Building2,
    Tags,
    Boxes,
    Users,
    ScrollText,
    SquareActivity,
} from "lucide-react";

const loggingApiUrl = import.meta.env.VITE_API_URL_LOG

export const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, to: '/admin/dashboard', section: 'dashboard' },
    { label: "Zonas", icon: MapPinned, to: '/admin/zones', section: 'zones' },
    { label: "Agencias", icon: Building2, to: '/admin/agencies/overview', section: 'agencies' },
    { label: "Tarifas", icon: Tags, to: '/admin/rates', section: 'rates' },
    { label: "Tipos de palet", icon: Boxes, to: '/admin/pallets', section: 'pallets' },
    { label: "Usuarios", icon: Users, to: '/admin/users', section: 'users' },
    { label: "Auditoría", icon: ScrollText, to: '/admin/audits', section: 'audits' },
    { label: "Log", icon: SquareActivity, to: loggingApiUrl, section: 'log' }
];