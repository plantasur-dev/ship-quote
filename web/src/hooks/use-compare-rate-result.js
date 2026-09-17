
import { useRef, useState } from "react";

import { getCompareRatesByPostalCode } from '../services/api-service';

export function useCompareRateResult() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resultRates, setResultRates] = useState([]);

    const resultBlockY = useRef(null);
    
    const handlerCalculateRates = async (data) => {
        setResultRates([]);
        setError(null);
        setIsLoading(true);

        if (resultBlockY.current) { 
            resultBlockY.current?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
        
        try {
            const rates = await getCompareRatesByPostalCode(data);
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

    return { resultBlockY, isLoading, error, resultRates, handlerCalculateRates };
};