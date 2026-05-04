
import { useState } from "react";

import { compareRate } from '../services/api-services';

export function useCompareRateResult() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resultRates, setResultRates] = useState([]);
    
    const handlerCalculateRates = async (data) => {
        setResultRates([]);
        setIsLoading(true);

        try {
            const rates = await compareRate(data);
            setResultRates(rates);
        } catch (error) {
            console.log(error);
            setError(error?.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, resultRates, handlerCalculateRates };
};