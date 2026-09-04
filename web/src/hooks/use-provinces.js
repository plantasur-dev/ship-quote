
import { useEffect, useState } from "react";

import { getProvinces } from '../services/api-service';

export function useProvinces(countryCode) {

    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            setIsLoading(true);

            try {
                const provinces = await getProvinces(countryCode);
                setProvinces(provinces);
            } catch (error) {
                const { errors } = error;
                console.error(errors);
            } finally {
                setIsLoading(false);
            }
        };    

        fetchProvinces();       
    }, [countryCode]);

    return { isLoadingProvinces: isLoading, provinces };
};