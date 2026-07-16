
import { useState, useEffect } from "react";

import { releaseLatest } from "../services/api-services";

export function useReleases() {

    const [release, setRelease] = useState(null);
    const [showNotification, setShowNotification] = useState(false);

    const handleCloseDismissNotification = () => {
        localStorage.setItem('lastSeenRelease', release.version);
        setShowNotification(false);
    };

    useEffect(() => {
        const fetchRelease = async () => {
            try {
                const latest = await releaseLatest();
            
                const lastSeenVersion = localStorage.getItem('lastSeenRelease');
                
                if (latest && lastSeenVersion !== latest.version) {
                    setRelease(latest);
                    setShowNotification(true);
                }
            } catch (error) {
                console.error("Error al obtener el release:", error)
            }
        }
        fetchRelease();
    }, []);

    return { release, showNotification, handleCloseDismissNotification };
}