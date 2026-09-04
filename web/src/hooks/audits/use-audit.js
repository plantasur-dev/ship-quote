
import { useEffect, useState } from "react";
import { useAlert } from '../../contexts/alert-context';
import { getActivityAudit } from "../../services/api-service";

export function useAudit({ activityId }) {

    const [activity, setActivity] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const alert = useAlert();

    useEffect(() => {
        const fetchAudit = async () => {

            if(!activityId) {
                setIsLoading(false);
                return;
            }
                        
            try {
                const activity = await getActivityAudit(activityId);
                setActivity(activity);
            } catch (error) {
                console.error(error);
                alert.error('Error cargando actividad', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAudit();
    }, [activityId]);

    return { activity, isLoading };
}