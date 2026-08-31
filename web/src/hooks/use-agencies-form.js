
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from '../utils';
import { useAlert } from '../contexts/alert-context'; 
import { createAgency, updateAgency } from '../services/api-service';

export function useAgenciesForm ({ mode, agencyId }) {
    
    const [isLoading, setIsLoading] = useState(true);
    const alert = useAlert();

    const navigate = useNavigate()

    const onSubmit = async (data, setError) => {   
        try {
            if (mode === "create") {
                await createAgency(data);

                alert.success("Agencia creada correctamente");
                await new Promise(resolve => setTimeout(resolve, 4000));   
            }

            if (mode === "edit") {
                await updateAgency(agencyId, data);

                alert.success("Agencia actualizada correctamente");
                await new Promise(resolve => setTimeout(resolve, 4000));
            }

            navigate(NAV_ITEMS[2].to);
        } catch (error) {
            Object.entries(error).forEach(([field, message]) => {
                setError(field, {
                    type: 'server',
                    message
                });

                alert.error(
                    mode === "create"
                        ? "Error al crear agencia"
                        : "Error al actualizar agencia",
                    message
                );
            });
        } finally {
            setIsLoading(false);
        }
    };
       
    return { isLoadingAgencies: isLoading, onSubmit }
}