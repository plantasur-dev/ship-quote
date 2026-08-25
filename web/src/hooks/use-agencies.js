
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

    const updateStateAgency = (agencyId) => {
        setAgencies((prev) =>
            prev.map((agency) => ( 
                agency.id === agencyId 
                ? { ...agency, active: !agency.active } 
                : agency
            ))
        );
    };

    const updateFuelSurcharge = (agencyId, fuelSurcharge) => {
        const supplements = { fuelSurcharge };
        
        setAgencies((prev) => 
            prev.map((agency) => (
                agency.id === agencyId
                ? { ...agency, supplements }
                : agency
            ))
        );
    };

    return {
        isLoadingAgencies: isLoading, 
        agenciesError: error, 
        agencies, 
        updateStateAgency, 
        updateFuelSurcharge 
    };
}