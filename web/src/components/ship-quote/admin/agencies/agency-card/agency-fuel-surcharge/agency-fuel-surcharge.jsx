
import { Check, Fuel, Hash, Percent, X } from "lucide-react";
import { useState, useRef } from "react";
import { RouteSpinner } from "../../../../../ui/loaders/loader";
import { updateFuelSurchargeAgency } from "../../../../../../services/api-service";
import { useAlert } from "../../../../../../contexts/alert-context";

function FuelSurchargeField({ agency, onUpdateFuel }) {

    const { active, supplements } = agency;

    const disabled = !active;

    const { 
        enabled: activeFuelSurcharge, 
        value, 
        type 
    } = supplements?.fuelSurcharge;
    
    const [draft, setDraft] = useState(value);
    const lastSavedValue = useRef(value);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errorSaved, setErrorSaved] = useState(false);

    const alert = useAlert();

    async function onSave(fuelDraftValue) {
        try {

            const fuelSurchargeData = { 
                enabled: activeFuelSurcharge,
                type,
                value: fuelDraftValue 
            };

            onUpdateFuel(agency.id, fuelSurchargeData);

            const resultUpdate = await updateFuelSurchargeAgency(agency.id, fuelSurchargeData);

            lastSavedValue.current = fuelDraftValue;

            setSaved(true);

            alert.success(`Suplemento Fuel de ${ agency.name } actualizado 
                ${ resultUpdate?.value }${ resultUpdate.type === 'percentage' ? '%':'#' }`
            );
        } catch(error) {
            alert.error(`Error al actualizar suplemento Fuel`, error);
            setDraft(lastSavedValue.current);
            setErrorSaved(true);
        }
    }
    
    async function commit() {
        const parsed = Number(draft);
        if (Number.isNaN(parsed) || parsed < 0 || parsed === value) {
            setDraft(lastSavedValue.current);
            return;
        }

        setSaving(true);
        await onSave(parsed);
        setSaving(false);
                
        setTimeout(() => {
            setSaved(false);
            setErrorSaved(false);
        }, 1500);
    }

    if (!activeFuelSurcharge) {
        return (
            <span className="flex items-center gap-1.5 text-[13px] text-text-muted">
                <Fuel size={ 13 }/> 
                Suplemento combustible no activo
            </span>
        );
    }

    return (
        <div>
            <label className="mb-1.5 flex justify-content gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                <Fuel size={ 11 } />
                Suplemento combustible
            </label>
            <div className="relative">
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={ draft }
                    disabled={ disabled || saving }
                    onChange={ (e) => setDraft(e.target.value) }
                    onBlur={ commit }
                    onKeyDown={ (e) => e.key === "Enter" && e.currentTarget.blur() }
                    className="
                        field-input w-full rounded-lg border border-panel-border bg-input-bg
                        py-1.5 pl-3 pr-8 text-sm text-text-primary transition-shadow
                        disabled:opacity-50
                    "
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                    { false ? (
                        <RouteSpinner size={ 13 } />
                    ) : errorSaved ?(
                        <X size={ 14 } className="text-danger" />
                    ) : saved ? (
                        <Check size={ 14 } className="text-accent" />
                    ) : (
                        type === 'percentage' ? <Percent size={ 13 } /> : <Hash size={ 13 }/>
                    )}
                </span>
            </div>
        </div>
    );
}

export default FuelSurchargeField;