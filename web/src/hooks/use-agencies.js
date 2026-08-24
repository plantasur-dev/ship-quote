
import { useState, useEffect } from "react";

import { listAgencies } from "../services/api-service";

export function useAgencies() {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agencies, setAgencies] = useState([]);

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const agencies = await listAgencies();
                setAgencies(agencies);    
            } catch (error) {
                setError({
                    type: 'error',
                    message: error?.message || 'Error cargando agencias'
                });
            } finally {
                setIsLoading(false);
            }
            
        };

        fetchAgencies();
    }, []);

    return { isLoadingAgencies: isLoading, agenciesError: error, agencies };
}