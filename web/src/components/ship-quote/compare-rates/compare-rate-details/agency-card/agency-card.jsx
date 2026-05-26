
import TotalServices from '../total-services/total-services';

import ServiceCard from '../service-card/service-card';

function AgencyCard({ agency, index, open, onToggle }) {

    const itemsServices = Object.values(agency.services?.reduce((acc, item) => {
        const serviceName = item.service || "Sin servicio";

        if (!acc[serviceName]) {
            acc[serviceName] = {
                service: serviceName,
                breakdown: [],
                itemCount: 0,
                total: 0,
                incidents: []
            };
        }

        acc[serviceName].breakdown.push(
            ...(item.breakdown || [])
        );

        acc[serviceName].incidents.push(
            ...(item.incidents || [])
        );

        acc[serviceName].itemCount += Number(item.itemCount || 0);

        acc[serviceName].total += Number(item.total || 0);

        return acc;
    }, {}));

    return (
        <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-md backdrop-blur-xl transition hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold capitalize">
                        { agency.agency }
                    </h3>

                    <p className="text-sm text-slate-500">
                        { agency.zone || "" }
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        agency.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    { agency.available ? "Disponible" : "No disponible" }
                </span>
            </div>

            <ServiceCard services={ itemsServices } /> 
        </div>
    );
}

export default AgencyCard;