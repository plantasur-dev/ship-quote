
import { CircleAlert, Globe2, MapPin } from "lucide-react";

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

export function SectionHeading({ eyebrow, title }) {
    return (
        <div className="mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{ eyebrow }</p>
            <h2 className="mt-0.5 font-display text-sm font-semibold text-text-primary">{ title }</h2>
        </div>
    );
}

export function FieldLabel({ children, required }) {
    return (
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-text-muted">
            { children }
            { required && <span className="text-danger"> *</span> }
        </label>
    );
}

export function FieldError({ size = 15, message }) {
    return (
        <div className="mt-1 ml-3 text-sm text-danger"> 
            <div className='flex items-center gap-1'> <CircleAlert size={ size } /> { message } </div>
        </div>
    );
}

function Toggle({ checked, onChange, disabled }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={ checked }
            onClick={() => onChange(!checked)}
            disabled={ disabled }
            className={`
                relative 
                h-6 
                w-11 
                shrink-0 
                rounded-full 
                border 
                transition-colors 
                disabled:opacity-50 
                cursor-pointer
                ${ checked ? 'border-accent bg-accent' : 'border-panel-border bg-info-soft' }`
            }
        >
            <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-canvas transition-transform
                    ${ checked ? 'translate-x-[-18px]' : 'translate-x-0.5' }`}
            />
        </button>
    );
}

function ToggleRow({ label, hint, checked, onChange, disabled }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5">
            <div>
                <p className="text-sm text-text-primary">{ label }</p>
                { hint && <p className="mt-0.5 text-xs text-text-muted">{ hint }</p>}
            </div>
            <Toggle checked={ checked } onChange={ onChange } disabled={ disabled } />
        </div>
    );
}

export function FormToggleRow({ controller, name, control, ...props }) {
    
    const Controller = controller;

    return (
        <Controller
            name={ name }
            control={ control }
            render={({ field }) => (
                <ToggleRow
                    { ...props }
                    checked={ field.value }
                    onChange={ field.onChange }
                />
            )}
        />
    );
}

export const loadFieldsDefault = (agency) => {
    return {
        name: agency?.name ?? '',
        type: agency?.type ?? '', 
        active: agency?.active ?? false,
        rules: {
            supportspallets: agency?.rules?.supportsPallets ?? false,
            supportsparcels: agency?.rules?.supportsParcels ?? false,
            hasandaluciarule: agency?.rules?.hasAndaluciaRule ?? false,
            coverage: agency?.rules.coverage ?? []
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
            },
            apikey: ''
        }
    }
}

export const validationsForm = ({ isEdit = false }) => {
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
            baseurlapi: { required: 'Endpoint conexión requerido' },
            apikey: { required: !isEdit ? 'ApiKey es requerida' : false }
        }
    }
}