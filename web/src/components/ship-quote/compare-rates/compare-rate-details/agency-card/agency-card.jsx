
import TotalServices from '../total-services/total-services';

import ServiceCard from '../service-card/service-card';

function AgencyCard({ agency, index, open, onToggle }) {
    return (
        <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-md backdrop-blur-xl transition hover:shadow-lg">
            
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold capitalize">
                        {agency.agency}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {agency.zone || ""}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        agency.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {agency.available ? "Disponible" : "No disponible"}
                </span>
            </div>

            {/* TOTAL SERVICES */}
            <TotalServices services={agency.services} />

            {/* SERVICES */}
            <div className="mt-5 space-y-4">
                {agency.services?.map((service, j) => (
                    <ServiceCard
                        key={j}
                        service={service}
                        agencyIndex={index}
                        serviceIndex={j}
                        open={open}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
}

export default AgencyCard;