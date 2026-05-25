
import { 
    Boxes, 
    Package, 
    Receipt 
} from 'lucide-react';

function TotalServices({ services, total }) {

    const groupedServices = (services || []).reduce((acc, service) => {

        if (Number(service.itemCount || 0) === 0) {
            return acc;
        }

        const serviceName = service.service || "Sin servicio";

        if (!acc[serviceName]) {
            acc[serviceName] = {
                service: serviceName,
                total: 0,
                itemCount: 0,
                services: []
            };
        }

        acc[serviceName].total += Number(service.total || 0);

        acc[serviceName].itemCount += Number(service.itemCount || 0);

        acc[serviceName].services.push(service);

        return acc;

    }, {});

    const groupedServicesArray = Object.values(groupedServices);

    if (!groupedServicesArray.length) return null;

    return (
        <div
            className="
                mt-5
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            <div
                className="
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-slate-900
                    to-slate-800
                    px-6
                    py-6
                    text-white
                "
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Receipt size={ 22 } />

                        <h3 className="text-sm font-semibold uppercase tracking-wide">
                            Total del envío
                        </h3>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="space-y-3">
                    { groupedServicesArray?.map((group, j) => (
                        <div
                            key={ j }
                            className="
                                flex
                                items-center
                                justify-between
                                rounded-2xl
                                border
                                border-slate-100
                                bg-slate-50/60
                                p-4
                                transition-all
                                duration-200
                                hover:border-slate-200
                                hover:bg-white
                            "
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`
                                        flex h-12 w-12 items-center justify-center rounded-2xl
                                        bg-gradient-to-br from-indigo-500 to-cyan-500
                                        text-white shadow-lg shadow-indigo-200
                                        transition-transform duration-300
                                        group-hover:scale-105
                                    `}
                                >
                                    <Boxes size={ 22 } />
                                </div>

                                <div>
                                    <p className="font-semibold capitalize text-slate-800">
                                        { group.service }
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        { group.itemCount } bultos
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-slate-400">
                                    Total Servicio
                                </p>

                                <p className="text-3xl font-black tracking-tight text-slate-900">
                                    { group.total.toFixed(2) }
                                    <span className="ml-1 text-lg font-semibold text-slate-500">
                                        €
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TotalServices;