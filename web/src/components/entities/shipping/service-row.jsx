
import { AlertTriangle } from "lucide-react";

function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value ?? 0);
}

function ServiceRow({ service }) {
    const { service: name, total, itemCount, breakdown = [], incidents = [] } = service;
 
    return (
        <div className="rounded-lg bg-panel-border/30 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-medium capitalize text-text-primary">{ name }</span>
                <span className="font-mono text-[14px] font-semibold text-text-primary">
                    { formatCurrency(total) }
                </span>
            </div>
 
            { breakdown.length > 0 && (
                <div className="mt-1.5 flex flex-col gap-0.5">
                    { breakdown.map((line, i) => (
                        <div key={ i } className="flex items-center justify-between text-[13px] text-text-muted">
                            <span>{ line.type }</span>
                            <span className="font-mono">{ formatCurrency(line.price) }{ line.unit ? ` / ${line.unit}` : '' }</span>
                        </div>
                    )) }
                </div>
            ) }
 
            { itemCount > 0 && (
                <span className="mt-1 inline-block text-[11px] text-text-muted">
                    { itemCount } { itemCount === 1 ? 'bulto' : 'bultos' }
                </span>
            ) }
 
            { incidents.length > 0 && (
                <div className="mt-1.5 flex items-start gap-1.5 rounded-md bg-rose-300/10 px-2 py-1 text-[11px] text-rose-300">
                    <AlertTriangle className="h-3 w-3 shrink-0 translate-y-0.5" />
                    <span>{ incidents.map(inc => inc.type).join(', ') }</span>
                </div>
            ) }
        </div>
    );
}

export default ServiceRow;