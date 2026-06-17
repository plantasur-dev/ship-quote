
import { useState } from "react";

import { compareRatesByPostalCode } from '../services/api-services';

export function useCompareRateResult() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resultRates, setResultRates] = useState([]);
    
    const handlerCalculateRates = async (data) => {
        setResultRates([]);
        setError(null);
        setIsLoading(true);

        try {
            const rates = await compareRatesByPostalCode(data);
            setResultRates(rates);
        } catch (error) {
            console.log(error);
            setError({
                type: 'error',
                message: error?.message || 'Error al calcular tarifas'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, resultRates, handlerCalculateRates };
};