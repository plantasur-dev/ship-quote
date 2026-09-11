
import { Globe2, MapPin } from "lucide-react";

export const COVERAGE_OPTIONS = [
    { value: "national", label: "Nacional", icon: MapPin },
    { value: "international", label: "Internacional", icon: Globe2 },
];

export const inputClass = `
    field-input 
    w-full 
    rounded-lg 

    border 
    bg-input-bg

    px-3 
    py-2 

    text-sm 
    text-text-primary 

    transition-shadow`;

export const loadFieldsDefault = (agency) => {
    return {
        name: agency?.name ?? '',
        type: agency?.type ?? '', 
        active: agency?.active ?? false,
        rules: {
            supportspallets: agency?.rules?.supportsPallets ?? false,
            supportsparcels: agency?.rules?.supportsParcels ?? false,
            hasandaluciarule: agency?.rules?.hasAndaluciaRule ?? false,
            coverage: agency?.rules?.coverage ?? []
        },
        supplements: {
            fuelsurcharge: {
                enabled: agency?.supplements?.fuelSurcharge?.enabled ?? false,
                type: agency?.supplements?.fuelSurcharge?.type ?? '',
                value: agency?.supplements?.fuelSurcharge?.value ?? 0
            }
        },
        apiconfig: {
            timeout: agency?.apiConfig?.timeout ?? 3000,
            baseurlapi: agency?.apiConfig?.baseUrlApi ?? '',
            endpoints: {
                quotations: agency?.apiConfig?.endpoints?.quotations ?? '',
                transportorders: agency?.apiConfig?.endpoints?.transportOrders ?? ''
            }
        }
    }
}

export const validationsForm = () => {
    return {
        name: { 
            required: 'Nombre agencia requerido',
            minLength: { value: 3, message: 'Longitud mínima de 3 caracteres.' },
            maxLength: { value: 14, message: 'Longitud máxima de 14 caracteres.' },
        },
        type: { required: 'Tipo agencia requerido' },
        rules: {
            coverage: { 
                required: 'Selecciona cobertura para agencia',
                validate: (value) => value.length > 0 || "Debes seleccionar al menos una cobertura"
            }
        },
        supplements: {
            fuelsurcharge: {
                type: { required: 'Selecciona tipo cálculo' },
                value: {
                    required: 'Añade cantidad al suplemento',
                    min: { value: 1, message: 'Cantidad mínima 1' },
                    validate: (value, formValues) => {
                        if (formValues.supplements.fuelsurcharge.type !== 'percentage') {
                            return true;
                        }
                        
                        return Number(value) <= 100 || 'No puede superar 100%';
                    }
                }
            }
        },
        apiconfig: {
            baseurlapi: { required: 'Endpoint conexión requerido' }
        }
    }
}