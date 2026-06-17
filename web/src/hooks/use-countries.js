
import { useEffect, useState } from "react";

import { listCountries } from '../services/api-services';

export function useCountries() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsLoading(true);
                const langClient = 
                    navigator.language.split('-')[1] || 
                    'ES';
                    
                const countries = await listCountries(langClient);
                setCountries(countries);
            } catch (error) {
                setError({
                    type: 'warning',
                    message: 'País asignado por defecto: España | ' + error?.message
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchCountries();
    }, []);

    return { isLoadingCountries: isLoading, countriesError: error, countries }
};