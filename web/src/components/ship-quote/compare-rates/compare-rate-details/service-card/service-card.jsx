
import ServiceBreakdown from '../service-Breakdown/service-breakdown';

import IncidentList from '../incident-list/incident-list';

function ServiceCard({ service, agencyIndex, serviceIndex, open, onToggle }) {
    const id = `${agencyIndex}-${serviceIndex}`;
    const isOpen = open === id;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-semibold capitalize text-slate-800">
                        {service.service}
                    </p>

                    {service.itemCount > 0 && (
                        <p className="mt-1 text-sm text-slate-500">
                            Total bultos: {service.itemCount}
                        </p>
                    )}
                </div>

                <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                        {service.total} €
                    </p>
                </div>
            </div>

            <button
                onClick={() => onToggle(id)}
                className="mt-3 text-sm font-medium text-indigo-500 hover:text-indigo-700"
            >
                {isOpen ? "Ocultar desglose" : "Ver desglose"}
            </button>

            {isOpen && (
                <div className="mt-4 space-y-3">
                    <ServiceBreakdown breakdown={service.breakdown} />
                    <IncidentList incidents={service.incidents} />
                </div>
            )}
        </div>
    );
}

export default ServiceCard;