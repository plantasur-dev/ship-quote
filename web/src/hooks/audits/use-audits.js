
import { useCallback, useState } from "react";
import { getRecentActivitiesAudit } from "../../services/api-service";

const EMPTY_FILTERS = {};

export function useAudits({ filters = EMPTY_FILTERS } = {}) {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAudits = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const activities = await getRecentActivitiesAudit(filters);

            setActivities(activities);
        } catch (error) {
            console.error('use-audits', error?.errors?.message);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    return {
        activities,
        isLoading,
        error,
        refetch: fetchAudits,
    };
}