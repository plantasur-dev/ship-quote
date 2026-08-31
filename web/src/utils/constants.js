
import { Hash, Percent } from "lucide-react";

export const TIMER_ACTIVITY = 60 * 1500;

export const REDIRECT_DELAY = 4000;

export const STATUS_MESSAGES = [
    "Sincronizando zonas",
    "Consultando tarifas",
    "Verificando agencias",
];

export const TYPE_FUEL_SURCHARGE = {
    percentage: { 
        code: 'percentage', 
        label: 'porcentaje', 
        icon: '%', 
        icon2: Percent 
    },
    fixed: { 
        code: 'fixed', 
        label: 'fijo', 
        icon: '#',
        icon2: Hash 
    }
};

export const TYPE_AGENCY = { api: 'api', hybrid: 'hybrid', static: 'static' };