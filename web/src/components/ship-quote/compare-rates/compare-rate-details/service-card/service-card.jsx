
import ServiceBreakdown from './service-Breakdown/service-breakdown';

import IncidentList from './incident-list/incident-list';

function ServiceCard({ services }) {

    return (
        <div className="mt-5 space-y-4">

            { services?.map((item, j) => (
                <div
                    key={ j }
                    className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >
                    <ServiceBreakdown item={ item } />

                    <IncidentList item={ item } />
                    
                </div>
            ))}
        </div>
    );
}

export default ServiceCard;