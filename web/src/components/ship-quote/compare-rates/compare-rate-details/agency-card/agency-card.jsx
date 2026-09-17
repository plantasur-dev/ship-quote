
import { Truck } from 'lucide-react';
import { agencyLogos } from '../../../../../assets/img/agencyLogos';

import ServiceCard from '../service-card/service-card';

function AgencyCard({ carrier }) {

    const itemsServices = Object.values(carrier.services?.reduce((acc, item) => {
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

    const agencyIcon = agencyLogos[carrier.agency.toUpperCase()];

    return (
        <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-md backdrop-blur-xl transition hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex h-12 w-12 shrink-0 items-center justify-center
                            overflow-hidden rounded-2xl
                            bg-white
                            shadow-sm ring-1 ring-slate-100
                        "
                    >
                        {agencyIcon ? (
                            <img
                                src={ agencyIcon }
                                alt={ carrier.agency }
                                className="h-full w-full object-contain p-1.5"
                            />
                        ) : (
                            <Truck
                                size={ 26 }
                                strokeWidth={ 1.8 }
                                className="text-indigo-500"
                            />
                        )}
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold capitalize text-slate-900">
                            {carrier.agency}
                        </h3>

                        {carrier.zone && (
                            <p className="mt-0.5 text-xs text-slate-500">
                                {carrier.zone}
                            </p>
                        )}
                    </div>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        carrier.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {carrier.available ? "Disponible" : "No disponible"}
                </span>
            </div>

            <ServiceCard services={itemsServices} />
        </div>
    );
}

export default AgencyCard;