
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from '../utils';
import { useAlert } from '../contexts/alert-context'; 
import { createAgency, updateAgency } from '../services/api-service';

const services = {
    create: { label: 'creada', function: () => createAgency },
    update: { label: 'actualizada', function: () => updateAgency }
}

export function useAgenciesForm ({ mode, agencyId }) {

    const [isLoading, setIsLoading] = useState(true);
    const alert = useAlert();

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        
        try {
            await createAgency(data);
                        
            alert.success(`Agencia ${ services[mode].label } correctamente`);

            await new Promise(resolve => setTimeout(resolve, 4000));

            navigate(NAV_ITEMS[2].to);
        } catch (error) {
            console.log(error)
            alert.error('Error al crear agencia', error);
        } finally {
            setIsLoading(false);
        }
    };
       
    return { 
        isLoadingAgencies: isLoading,
        onSubmit
    }
}