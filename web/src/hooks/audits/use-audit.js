
import { useEffect, useState } from "react";
import { getActivityAudit } from "../../services/api-service";


export function useAudit({ activityId }) {

    const [activity, setActivity] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAudit = async () => {

            if(!activityId) {
                setIsLoading(false);
                setError(null);
                return;
            }
                        
            try {
                const activity = await getActivityAudit(activityId);
                setActivity(activity);
            } catch (error) {
                console.error(error?.errors?.message);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAudit();
    }, [activityId]);

    return { activity, isLoading, error };
}