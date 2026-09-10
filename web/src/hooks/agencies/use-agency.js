
import { useEffect, useState } from "react";
import { useAlert } from '../../contexts/alert-context'; 
import { getAgency } from "../../services/api-service";

export function useAgency({ agencyId }) {

    const [isLoading, setIsLoading] = useState(Boolean(agencyId));
    const [agency, setAgency] = useState(null);

    const alert = useAlert();

    useEffect(() => {
        if (!agencyId) {
            return;
        }

        const fetchAgency = async () => {
            setIsLoading(true);
            
            try {
                const agencyData = await getAgency(agencyId);
                setAgency(agencyData);
            } catch (error) {
                console.error(error);
                alert.error('Error cargando agencia', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgency();
    }, [agencyId]);

    return { agency, isLoading };
}