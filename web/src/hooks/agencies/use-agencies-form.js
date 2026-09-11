
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS, REDIRECT_DELAY, wait } from '../../utils';
import { useAlert } from '../../contexts/alert-context'; 
import { createAgency, updateAgency, deleteAgency } from '../../services/api-service';

export function useAgenciesForm ({ mode, agencyId }) {
    
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [isLoadingDeleting, setLoadingIsDeleting] = useState(false);
    
    const alert = useAlert();

    const navigate = useNavigate()

    const onSubmit = async (data, setError, clearErrors) => {   
        setIsLoadingForm(true);
        clearErrors();

        try {
            if (mode === "create") {
                await createAgency(data);
                alert.success("Agencia creada correctamente");   
            }

            if (mode === "edit") {
                await updateAgency(agencyId, data);
                alert.success("Agencia actualizada correctamente");
            }

            await wait(REDIRECT_DELAY);
            navigate(NAV_ITEMS[2].to);
        } catch (error) {
            if (error.type === 'validations') {
                Object.entries(error.errors).forEach(([field, errorDetail]) => {
                    setError(field.toLowerCase(), {
                        message: errorDetail.message,
                    });
                });
            }

            if (error.type === 'server') {
                alert.error(
                    (mode === "create")
                        ? "Error al crear agencia"
                        : "Error al actualizar agencia",
                    error.errors || "Ha ocurrido un error en el servidor"
                );
            }            
        } finally {
            setIsLoadingForm(false);
        }
    };

    const onDelete = async () => { 
        setLoadingIsDeleting(true);

        try {
            await deleteAgency(agencyId);
            alert.success("Agencia eliminada correctamente");
            await wait(REDIRECT_DELAY);
            navigate(NAV_ITEMS[2].to);
        } catch (error) {
            console.log(error);
            alert.error('Error eliminando agencia', error);
        } finally {
            setLoadingIsDeleting(false);
        }
                
    };
       
    return { isLoadingForm, isLoadingDeleting, onSubmit, onDelete }
}