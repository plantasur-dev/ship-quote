
import { CheckCircle2, Layers, Truck, XCircle } from "lucide-react";
import ServiceRow from "./service-row";

function AgencyCard({ agencyResult }) {
    const { agency, available, zone, services = [] } = agencyResult;
 
    return (
        <div className="rounded-xl border border-panel-border p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-text-muted" />
                    <span className="text-[15px] font-semibold text-text-primary">{ agency }</span>
                </div>
 
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-panel-border px-2 py-0.5 text-[10px] text-text-muted">
                        <Layers className="h-3 w-3" />
                        { zone }
                    </span>
 
                    { available ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-green-300/25 bg-green-300/10 px-2 py-0.5 text-[10px] font-medium text-green-300">
                            <CheckCircle2 className="h-3 w-3" />
                            Disponible
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-300/25 bg-rose-300/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                            <XCircle className="h-3 w-3" />
                            No disponible
                        </span>
                    ) }
                </div>
            </div>
 
            <div className="flex flex-col gap-1.5">
                { services.map((service, i) => (
                    <ServiceRow key={ i } service={ service } />
                )) }
            </div>
        </div>
    );
}

export default AgencyCard;