
function Bar({ className = "" }) {
    return <div className={`animate-pulse rounded bg-panel-border ${className}`} />;
}

function ItemCardSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-panel-border px-3 py-2">
            <Bar className="h-4 w-4 rounded-full" />
            <div className="flex flex-col gap-1.5">
                <Bar className="h-3 w-20" />
                <Bar className="h-2.5 w-28" />
            </div>
        </div>
    );
}

function ServiceRowSkeleton() {
    return (
        <div className="rounded-lg bg-panel-border/30 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
                <Bar className="h-3 w-24" />
                <Bar className="h-3.5 w-14" />
            </div>
            <div className="mt-2 flex flex-col gap-1">
                <Bar className="h-2.5 w-full max-w-[180px]" />
                <Bar className="h-2.5 w-full max-w-[140px]" />
            </div>
        </div>
    );
}

function AgencyCardSkeleton({ serviceCount = 2 }) {
    return (
        <div className="rounded-xl border border-panel-border p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Bar className="h-4 w-4 rounded-full" />
                    <Bar className="h-3.5 w-20" />
                </div>
                <div className="flex items-center gap-2">
                    <Bar className="h-4 w-16 rounded-full" />
                    <Bar className="h-4 w-20 rounded-full" />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                { Array.from({ length: serviceCount }).map((_, i) => (
                    <ServiceRowSkeleton key={ i } />
                )) }
            </div>
        </div>
    );
}

function AuditDetailsSkeleton() {
    return (
        <div className="flex flex-col gap-5 text-sm">

            {/* Cabecera */}
            <div className="flex items-center justify-between gap-3 border-b border-panel-border pb-4">
                <div className="flex items-center gap-2">
                    <Bar className="h-6 w-32 rounded-full" />
                    <Bar className="h-3 w-36" />
                </div>
                <Bar className="h-3 w-24" />
            </div>

            {/* Consulta */}
            <div>
                <Bar className="mb-2 h-2.5 w-16" />
                <Bar className="mb-3 h-6 w-40 rounded-full" />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <ItemCardSkeleton />
                    <ItemCardSkeleton />
                </div>
            </div>

            {/* Resultados */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <Bar className="h-2.5 w-32" />
                    <Bar className="h-2.5 w-20" />
                </div>
                <div className="flex flex-col gap-2">
                    <AgencyCardSkeleton serviceCount={ 1 } />
                    <AgencyCardSkeleton serviceCount={ 2 } />
                    <AgencyCardSkeleton serviceCount={ 1 } />
                </div>
            </div>
        </div>
    );
}

export default AuditDetailsSkeleton;