
import {Truck, User } from "lucide-react";
import AuditDetailsSkeleton from "./audit-details-skeleton";
import { AgencyCard, ItemCard, Province } from "../../../../entities/shipping";
import { useAudit } from "../../../../../hooks";
import { formatClock } from "../../../../../utils";
 
function formatFullDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

function AuditDetails({ activityId }) {

    const { activity, isLoading } = useAudit({ activityId });

    const { action, createdAt, userId, ip, input = {}, response = {} } = activity;
 
    const { countryCode, destinationPostalCode, province, items = [] } = input;
  
    const agencies = Object.values(response ?? {});
    const availableCount = agencies.filter(a => a.available).length;

    if (isLoading) {
        return <AuditDetailsSkeleton />;
    }

    return (
        <div className="flex flex-col gap-5 text-sm">
 
            <div className="flex items-center justify-between gap-3 border-b border-panel-border pb-4">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-panel-border bg-panel-border/40 px-2.5 py-1 text-[11px] font-medium tracking-wide text-text-primary">
                        <Truck className="h-3.5 w-3.5" />
                        { action }
                    </span>
                    <span className="text-[11px] text-text-muted">
                        { formatFullDate(new Date(createdAt)) } · { formatClock(new Date(createdAt)) }
                    </span>
                </div>
 
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                    <User className="h-3.5 w-3.5" />
                    { userId?.username ?? ip }
                </div>
            </div>
 
            <div>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    Consulta
                </h3>

                <Province 
                    countryCode={ countryCode } 
                    codePostal={ destinationPostalCode }
                    className={ 'mb-3' } 
                />
 
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    { items.map((item, i) => (
                        <ItemCard key={ i } item={ item } />
                    )) }
                </div>
            </div>
 
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                        Resultados por agencia
                    </h3>
                    <span className="text-[11px] text-text-muted">
                        { availableCount } de { agencies.length } disponibles
                    </span>
                </div>
 
                <div className="flex flex-col gap-2">
                    { agencies.map((agencyResult, i) => (
                        <AgencyCard key={ i } agencyResult={ agencyResult } />
                    )) }
                </div>
            </div>
        </div>
    );
}

export default AuditDetails;