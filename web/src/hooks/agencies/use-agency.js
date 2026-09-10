
import { useEffect, useState } from "react";
import { getAgency } from "../../services/api-service";

export function useAgency({ agencyId }) {

    const [isLoading, setIsLoading] = useState(Boolean(agencyId));
    const [agency, setAgency] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!agencyId) {
            return;
        }

        const fetchAgency = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const agencyData = await getAgency(agencyId);
                setAgency(agencyData);
            } catch (error) {
                console.error(error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgency();
    }, [agencyId]);

    return { agency, isLoading, error };
}