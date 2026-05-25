
function TotalServices({ services }) {

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
                rounded-3xl
                border
                border-slate-200/70
                bg-white/80
                p-5
                shadow-sm
                backdrop-blur-xl
            "
        >
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Resumen de servicios
                    </h3>

                    <p className="text-sm text-slate-500">
                        Totales agrupados por tipo de envío
                    </p>
                </div>

                <div
                    className="
                        rounded-2xl
                        bg-indigo-50
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-indigo-600
                    "
                >
                    {groupedServicesArray.length} servicios
                </div>
            </div>

            <div className="space-y-3">
                {groupedServicesArray?.map((group, j) => (
                    <div
                        key={j}
                        className="
                            group
                            flex
                            items-center
                            justify-between
                            rounded-2xl
                            border
                            border-slate-100
                            bg-gradient-to-r
                            from-white
                            to-slate-50/80
                            p-4
                            transition-all
                            duration-200
                            hover:border-indigo-200
                            hover:shadow-md
                        "
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-indigo-100
                                    text-indigo-600
                                    shadow-inner
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 18.75a1.5 1.5 0 003 0m4.5 0a1.5 1.5 0 003 0M3 3h1.386a1.5 1.5 0 011.465 1.175L6.61 8.25m0 0h11.356a1.5 1.5 0 001.474-1.224l1.038-5.25H6.61zm0 0L4.939 15.75A1.5 1.5 0 006.413 17.5H19.5"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-base font-semibold capitalize text-slate-800">
                                    {group.service}
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                    <span
                                        className="
                                            rounded-full
                                            bg-slate-100
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            text-slate-600
                                        "
                                    >
                                        {group.itemCount} bultos
                                    </span>

                                    <span className="text-xs text-slate-400">
                                        Servicio agrupado
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Total
                            </p>

                            <p
                                className="
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-indigo-600
                                "
                            >
                                {group.total.toFixed(2)}
                                <span className="ml-1 text-lg font-semibold">
                                    €
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TotalServices;