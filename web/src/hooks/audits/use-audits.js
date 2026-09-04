
import { useCallback, useEffect, useState } from "react";
import { getRecentActivitiesAudit } from "../../services/api-service"; 
import { TIMER_ACTIVITY, wait } from "../../utils";

export function useAudits({ polling = true, filter = {} } = {}) {

    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
      
    const fetchAudit = useCallback(async () => {
        setIsLoading(true);
        await wait(400);

        try {
            const activity = await getRecentActivitiesAudit(filter);
            setActivities(activity);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchAudit();

        if (!polling) {
            return;
        }

        const timer = setInterval(() => fetchAudit(), TIMER_ACTIVITY);

        return () => clearInterval(timer);
    }, [fetchAudit, polling]);

    return { activities, isLoading, fetchAudit };
}