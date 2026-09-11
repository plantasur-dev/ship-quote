
import { useEffect } from "react";

export function usePolling(callback, interval) {
    useEffect(() => {
        callback();

        const timer = setInterval(callback, interval);

        return () => clearInterval(timer);
    }, [callback, interval]);
}