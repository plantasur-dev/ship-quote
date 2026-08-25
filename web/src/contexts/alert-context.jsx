
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const VARIANTS = {
    success: {
        icon: CheckCircle2,
        border: "border-accent",
        iconColor: "text-accent",
        bar: "bg-accent",
    },
    error: {
        icon: XCircle,
        border: "border-danger",
        iconColor: "text-danger",
        bar: "bg-danger",
    },
    warning: {
        icon: AlertTriangle,
        border: "border-warning",
        iconColor: "text-warning",
        bar: "bg-warning",
    },
    info: {
        icon: Info,
        border: "border-info",
        iconColor: "text-info",
        bar: "bg-info",
    },
};

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([]);
 
    const dismiss = useCallback((id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);
 
    const push = useCallback((variant, title, opts = {}) => {
        const id = crypto.randomUUID();
        const { message, duration = 4000 } = opts;
        setAlerts((prev) => [...prev, { id, variant, title, message, duration }]);
        return id;
    }, []);
 
    const api = {
        success: (title, opts) => push("success", title, opts),
        error: (title, opts) => push("error", title, opts),
        warning: (title, opts) => push("warning", title, opts),
        info: (title, opts) => push("info", title, opts),
        dismiss,
    };
 
    return (
        <AlertContext.Provider value={ api }>
            { children }
            <AlertViewport alerts={ alerts } onDismiss={ dismiss } />
        </AlertContext.Provider>
    );
}
 
export function useAlert() {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("useAlert debe usarse dentro de <AlertProvider>");
    return ctx;
}
 
function AlertViewport({ alerts, onDismiss }) {
    return (
        <div
            className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2.5 px-4"
            aria-live="polite"
        >
            {alerts.map((alert) => (
                <AlertToast key={ alert.id } {...alert} onDismiss={ () => onDismiss(alert.id) } />
            ))}
        </div>
    );
}
 
function AlertToast({ variant, title, message, duration, onDismiss }) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);
 
    const { icon: Icon, border, iconColor, bar } = VARIANTS[variant] ?? VARIANTS.info;
 
    useEffect(() => {
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(raf);
    }, []);
 
    useEffect(() => {
        timeoutRef.current = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timeoutRef.current);
    }, [duration]);
 
    function handleTransitionEnd() {
        if (!visible) onDismiss();
    }
 
    return (
        <div
            role="alert"
            onTransitionEnd={ handleTransitionEnd }
            className={`
                pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border bg-panel shadow-2xl
                transition-all duration-300 ease-out 
                ${ border }
                ${ visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0' }`}
        >
            <div className="flex items-start gap-3 px-4 py-3.5">
                <Icon size={ 18 } className={ `mt-0.5 shrink-0 ${ iconColor }` } />
 
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{ title }</p>
                    {message && <p className="mt-0.5 text-xs text-text-muted">{ message }</p>}
                </div>
 
                <button
                    type="button"
                    onClick={ () => setVisible(false) }
                    aria-label="Cerrar notificación"
                    className="shrink-0 text-text-muted transition-colors hover:text-text-primary"
                >
                    <X size={ 15 } />
                </button>
            </div>
 
            <div className="h-0.5 w-full bg-input-bg">
                <div
                    className={ `h-full ${ bar } alert-progress` }
                    style={{ animationDuration: `${ duration }ms` }}
                />
            </div>
 
            <style>{`
                @keyframes alertProgress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .alert-progress {
                    animation-name: alertProgress;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .alert-progress { animation: none; width: 0%; }
                }
            `}</style>
        </div>
    );
}