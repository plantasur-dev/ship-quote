
import { useEffect, useState } from "react";

import { getAgency } from "../../services/api-service";

export function useAgency(agencyId) {

    const [isLoading, setIsLoading] = useState(true);
    const [agency, setAgency] = useState(null);

    useEffect(() => {
        if (!agencyId) {
            setIsLoading(false);
            return;
        }

        const fetchAgency = async () => {
            try {
                const agency = await getAgency(agencyId);
                setAgency(agency);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgency();
    }, [agencyId]);

    return { agency, isLoading };
}