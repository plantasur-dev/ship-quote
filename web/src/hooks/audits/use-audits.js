
import { useCallback, useState } from "react";
import { getRecentActivitiesAudit, getSearchActivitiesAudit } from "../../services/api-service";

const EMPTY_FILTERS = {};


export function useAudits({ typeList = false, filters = EMPTY_FILTERS } = {}) {
    
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    const fetchAudits = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const activities = !typeList 
                ? await getRecentActivitiesAudit(filters)
                : await getSearchActivitiesAudit(filters);

            setActivities(activities);
            setPagination(activities.pagination);
        } catch (error) {
            console.error('use-audits', error?.errors?.message);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [filters, typeList]);

    return {
        activities,
        isLoading,
        error,
        refetch: fetchAudits,
        pagination
    };
}