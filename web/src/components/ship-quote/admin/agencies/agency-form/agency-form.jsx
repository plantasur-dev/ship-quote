
import './agency-form.css';
import { Save } from "lucide-react";
import { Controller, useForm } from 'react-hook-form';
import { DeleteButton } from '../../../../ui';
import { RouteSpinner } from "../../../../ui/loaders/loader";
import { TYPE_AGENCY } from '../../../../../utils';
import { 
    COVERAGE_OPTIONS, 
    SectionHeading, 
    FieldLabel,
    FieldError,
    FormToggleRow,
    inputClass,
    validationsForm,
    loadFieldsDefault
} from './agency-form-util';

function AgencyForm({ 
    agency, 
    handleOnSubmit = () => {}, 
    handleOnDelete = () => {}, 
    isEdit = false 
}) {
    
    const defaultValues = loadFieldsDefault(agency);

    const validations = validationsForm({ isEdit });
    
    const { 
        register, 
        handleSubmit,
        control,
        watch,
        reset,
        setError,
        clearErrors,
        formState: { isSubmitting, isValid, errors } 
    } = useForm({ 
        mode: 'all', 
        reValidateMode: "onChange",
        defaultValues
    });

    const isActiveFuelSurcharge = watch('supplements.fuelsurcharge.enabled');
    const typeFuelSurcharge = watch('supplements.fuelsurcharge.type');
    const typeAgency = watch('type');

    const isApiType = typeAgency === TYPE_AGENCY.api || typeAgency === TYPE_AGENCY.hybrid;

    const hasFuelSurchargeError = !!errors.supplements?.fuelsurcharge?.type;
    
    return (
        <div className="min-h-screen space-y-6 bg-canvas p-6 lg:p-8">
                    
            <form onSubmit={ handleSubmit((data) => handleOnSubmit(data, setError, clearErrors)) } className="mx-auto max-w-2xl space-y-5">
                
                <div className="rounded-2xl border border-panel-border bg-panel p-6">
                    <SectionHeading eyebrow="01 · Identificación" title="Datos generales" />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <FieldLabel required>Nombre</FieldLabel>
                            <input
                                id='name'
                                type='text'
                                placeholder='Example Cayco'
                                className={`${ inputClass } ${ errors.name ? 'border-2 !border-danger focus:!border-danger' : 'border-panel-border'}` }
                                { ...register('name', validations.name) }                            
                            />
                            { errors.name && <FieldError message={ errors.name.message }/> }
                        </div>

                        <div>
                            <FieldLabel required>Tipo</FieldLabel>
                            <select
                                id='type'
                                className={`${ inputClass } cursor-pointer ${ errors.type ? 'border-2 !border-danger focus:!border-danger' : 'border-panel-border'}` }
                                { ...register('type', validations.type) }
                            >
                                <option value=''></option>
                                <option value="static">Estática</option>
                                <option value="api">API</option>
                                <option value="hybrid">Híbrida</option>
                            </select>
                            { errors.type && <FieldError message={ errors.type.message }/> }
                        </div>

                        <div className="flex items-end pb-2.5">
                            <FormToggleRow
                                name="active"
                                controller={ Controller }
                                control={ control }
                                label="Activa"
                                hint="Disponible para cotizar de inmediato"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-panel-border bg-panel p-6">
                    <SectionHeading eyebrow="02 · Reglas" title="Reglas de cotización" />

                    <div className="divide-y divide-panel-border">
                        <FormToggleRow
                            name="rules.supportspallets"
                            controller={ Controller }
                            control={ control }
                            label="Admite palets"
                        />

                        <FormToggleRow
                            name="rules.supportsparcels"
                            controller={ Controller }
                            control={ control }
                            label="Admite paquetería"
                        />

                        <FormToggleRow
                            name="rules.hasandaluciarule"
                            controller={ Controller }
                            control={ control }
                            label="Regla especial Andalucía"
                            hint="Aplica el recargo/ajuste específico para envíos a Andalucía"
                        />
                    </div>

                    <div className="mt-4">
                        <FieldLabel required>Cobertura</FieldLabel>
                        <div className="flex gap-2">
                            <Controller 
                                name={ 'rules.coverage' }
                                control={ control }
                                rules={ validations.rules.coverage }
                                render={({ field, fieldState: { error }  }) => (
                                    <>
                                        { COVERAGE_OPTIONS.map(({ value, label, icon: Icon }) => {
                                            const selected = field.value?.includes(value);
                                            
                                            return (
                                                <button
                                                    key={ value }
                                                    type='button'
                                                    onClick={ () => {
                                                        const nextValue = selected
                                                            ? field.value.filter(item => item !== value)
                                                            : [...field.value, value];

                                                        field.onChange(nextValue);
                                                    }}
                                                    className={`
                                                        flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors cursor-pointer
                                                        ${ selected 
                                                            ? 'border-accent bg-accent-soft text-accent' 
                                                            : 'border-panel-border text-text-muted hover:text-text-primary' 
                                                        }
                                                    `}
                                                >
                                                    <Icon size={12} />
                                                    { label }
                                                </button>
                                            );
                                        })}
                                        
                                        { error && <FieldError message={ error.message }/> }
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-panel-border bg-panel p-6">
                    <SectionHeading eyebrow="03 · Suplementos" title="Suplemento de combustible" />

                    <FormToggleRow
                        name="supplements.fuelsurcharge.enabled"
                        controller={ Controller }
                        control={ control }
                        label="Aplicar suplemento"
                    />

                    { isActiveFuelSurcharge && (
                        <div className="mt-3 grid grid-cols-2 gap-4 border-t border-panel-border pt-4">
                            <div>
                                <FieldLabel>Tipo</FieldLabel>
                                <select
                                    id='supplements.fuelsurcharge.type'
                                    className={`${ inputClass } cursor-pointer
                                        ${ errors.supplements?.fuelsurcharge?.type 
                                            ? 'border-2 !border-danger focus:!border-danger' 
                                            : 'border-panel-border'}` 
                                    }
                                    { ...register('supplements.fuelsurcharge.type', 
                                        validations.supplements.fuelsurcharge.type) 
                                    }
                                >
                                    <option value=""></option>
                                    <option value="percentage">Porcentaje </option>
                                    <option value="fixed">Fijo </option>
                                </select>
                                { errors.supplements?.fuelsurcharge?.type && 
                                    <FieldError message={ errors.supplements.fuelsurcharge.type.message }/> }
                            </div>
                            <div>
                                <FieldLabel>Valor</FieldLabel>
                                <div className="relative">
                                    <input
                                        disabled={ hasFuelSurchargeError }
                                        id='supplements.fuelsurcharge.value'
                                        type="number"
                                        step="0.1"
                                        className={`${ inputClass } pr-8 
                                            ${ errors.supplements?.fuelsurcharge?.value 
                                                ? 'border-2 !border-danger focus:!border-danger' 
                                                : 'border-panel-border'
                                            }
                                            ${ hasFuelSurchargeError && 'cursor-not-allowed'}`
                                        }
                                        { ...register('supplements.fuelsurcharge.value', 
                                            validations.supplements.fuelsurcharge.value) 
                                        }
                                    />
                                    { !errors.supplements?.fuelsurcharge?.value &&
                                        (<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                                            { typeFuelSurcharge === "percentage" ? "%" : "#" }
                                        </span>)
                                    }
                                    
                                    { errors.supplements?.fuelsurcharge?.value && 
                                        <FieldError message={ errors.supplements.fuelsurcharge.value.message }/> }
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {isApiType && (
                    <div className="rounded-2xl border border-panel-border bg-panel p-6">
                        <SectionHeading eyebrow="04 · Conexión" title="Configuración de API" />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pb-3">
                            <div>
                                <FieldLabel>Timeout (ms)</FieldLabel>
                                <input
                                    id='apiconfig.timeout'
                                    type="number"
                                    step="100"
                                    min="0"
                                    defaultValue={ 3000 }
                                    className={ `${ inputClass } border-panel-border` }
                                    { ...register('apiconfig.timeout') }
                                />
                            </div>
                            <div>
                                <FieldLabel required>URL base de la API</FieldLabel>
                                <input
                                    id='apiconfig.baseurlapi'
                                    type="text"
                                    placeholder="https://api.carrier.com"
                                    className={ `${inputClass} ${ errors.apiconfig?.baseurlapi 
                                        ? 'border-2 !border-danger focus:!border-danger' 
                                        : 'border-panel-border'
                                    }`}
                                    { ...register('apiconfig.baseurlapi', 
                                        validations.apiconfig?.baseurlapi
                                    )}
                                />
                                { errors.apiconfig?.baseurlapi && 
                                    <FieldError message={ errors.apiconfig.baseurlapi.message }/> }
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-4 border-t border-panel-border pt-4">
                            <div className='flex flex-col gap-4 sm:col-span-2'>
                                <FieldLabel>EndPoints</FieldLabel>
                                <div>
                                    <input
                                        id='apiconfig.endpoints.quotations'
                                        type="text"
                                        placeholder="quotations"
                                        className={ `${ inputClass } border-panel-border` }
                                        { ...register('apiconfig.endpoints.quotations')}
                                    />
                                </div>
                                
                                <div>
                                    <input
                                        id='apiconfig.endpoints.transportorders'
                                        type="text"
                                        placeholder="transportOrders"
                                        className={ `${ inputClass } border-panel-border` }
                                        { ...register('apiconfig.endpoints.transportorders')}
                                    />
                                </div>
                            </div>
                        </div>                    
                    </div>
                )}

                { isApiType && (
                    <p className="mt-3 text-xs text-text-muted">
                        Las agencias API e Híbridas necesitan endpoints para las consultas; no olvide añadirla para no tener problemas de conexión.
                    </p>
                )}

                <div className="flex justify-end gap-2.5">
                    { !isEdit ?
                        <button
                            type="button"
                            onClick={ () => reset({ ...defaultValues }) }
                            className="rounded-xl border border-panel-border px-4 py-2.5 text-sm text-text-muted transition-colors hover:text-text-primary cursor-pointer"
                        >
                            Limpiar
                        </button>
                    :
                        <DeleteButton onDelete={ handleOnDelete }/>   
                    }
                    <button
                        type="submit"
                        disabled={ !isValid }
                        className={`
                            flex 
                            items-center 
                            gap-2 
                            rounded-xl 
                            bg-accent 
                            px-5 
                            py-2.5 
                            text-sm 
                            font-semibold 
                            text-canvas 
                            transition-opacity 
                            disabled:opacity-60 
                            ${ isValid 
                                ? 'cursor-pointer' 
                                : 'cursor-not-allowed'
                            }
                        `}
                    >
                        { isSubmitting ? <RouteSpinner size={ 15 } /> : <Save size={ 15 } />}
                        { !isEdit ? 'Crear' : 'Guardar' } agencia
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AgencyForm;