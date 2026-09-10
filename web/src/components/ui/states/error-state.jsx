
import { SearchX, ServerCrash, AlertTriangle, WifiOff, RefreshCcw } from "lucide-react";

const VARIANTS = {
    404: {
        icon: SearchX,
        title: "No se ha encontrado",
        description: "El recurso que buscas no existe o ha sido eliminado."
    },
    server: {
        icon: ServerCrash,
        title: "Algo ha fallado",
        description: "Ha ocurrido un error inesperado al cargar los datos."
    },
    ERR_NETWORK: {
        icon: WifiOff,
        title: "Sin conexión",
        description: "No hemos podido conectar con el servidor. Comprueba tu conexión."
    },
    unknown: {
        icon: AlertTriangle,
        title: "Ha ocurrido un error",
        description: "No hemos podido completar la operación."
    }
};

function ErrorState({
    variant = 'unknown',
    title,
    description,
    code,
    onRetry,
    retryLabel = 'Reintentar'
}) {
    const preset = VARIANTS[variant] ?? VARIANTS.generic;
    const Icon = preset.icon;

    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-panel-border px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-300/25 bg-rose-300/10 text-rose-300">
                <Icon className="h-6 w-6" />
            </span>

            { code && (
                <span className="font-mono text-[11px] tracking-wider text-text-muted">
                    ERROR { code }
                </span>
            ) }

            <h3 className="text-[15px] font-semibold text-text-primary">
                { title ?? preset.title }
            </h3>

            <p className="max-w-[320px] text-[13px] text-text-muted">
                { description ?? preset.description }
            </p>

            { onRetry && (
                <button
                    type="button"
                    onClick={ onRetry }
                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-panel-border px-3 py-1.5 text-[12px] font-medium text-text-primary transition-colors hover:bg-panel-border/40"
                >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    { retryLabel }
                </button>
            ) }
        </div>
    );
}

export default ErrorState;