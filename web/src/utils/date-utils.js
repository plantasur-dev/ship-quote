
import { useEffect, useState } from "react";

export function useLiveClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(id);
    }, []);

    return now;
};

export function formatDay(date) {
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
};

export function formatTime(time) {
    return time.toLocaleTimeString("es-ES");
};

const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export function formatClock(date) {
    const day = WEEKDAYS[date.getDay()];
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${dd} · ${hh}:${mm}`;
}