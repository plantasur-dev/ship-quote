
import { useEffect, useState } from "react";

import { locationsProvinces } from '../services/api-services';

export function useProvinces(countryCode) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        if (countryCode !== 'ES') return;

        const fetchProvinces = async () => {
            try {
                setIsLoading(true);
                const provinces = await locationsProvinces();
                setProvinces(provinces);
            } catch (error) {
                setError(error?.message || 'Error cargando provincias');
            } finally {
                setIsLoading(false);
            }
        };    

        fetchProvinces();       
    }, [countryCode]);

    return { isLoadingProvinces: isLoading, provincesError: error, provinces };
};