
import { useEffect, useState } from "react";

import { locationsCountries } from '../services/api-services';

export function useCountries() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsLoading(true);
                const countries = await locationsCountries();
                const langClient = navigator.language.split('-')[1];
                setCountries(countries?.[langClient] || countries?.['US']);    
            } catch (error) {
                setError('País asignado por defecto: España | ' + error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCountries();
    }, []);

    return { isLoadingCountries: isLoading, countriesError: error, countries }
};