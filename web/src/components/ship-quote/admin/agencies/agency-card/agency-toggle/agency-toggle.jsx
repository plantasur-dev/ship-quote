
import { useState } from "react";
import { useAlert } from "../../../../../../contexts/alert-context";
import { setActiveAgency } from "../../../../../../services/api-service";

function ActiveToggle({ agency, onToggle }) {

    const [busy, setBusy] = useState(false);

    const alert = useAlert();

    const active = agency.active;

    async function handleToggle() {
        try {
            setBusy(true);
            onToggle(agency.id);    
            alert.success(`Agencia ${ agency.name } ${ !active ? 'activada': 'desactivada' }`);
            await setActiveAgency(agency.id);
            setBusy(false);     
        } catch(error) {
            alert.error(`Error al ${ !active ? 'activar': 'desactivar' } agencia ${ agency.name }`, error);
            onToggle(agency.id);
            setBusy(false);
        }
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={ active }
            aria-label={ active ? "Desactivar agencia" : "Activar agencia" }
            onClick={ handleToggle }
            disabled={ busy }
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
                ${ active ? 'border-accent bg-accent' : 'border-panel-border bg-info-soft' }`}
        >
            <span
                className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-canvas transition-transform 
                    ${ !active ? 'translate-x-[-18px]' : 'translate-x-0.5' }`}
            />
        </button>
    );
}

export default ActiveToggle;