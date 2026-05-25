
import {
    Boxes,
    Package,
    AlertTriangle,
    ReceiptText
} from 'lucide-react';

import ServiceBreakdown from '../service-Breakdown/service-breakdown';

import IncidentList from '../incident-list/incident-list';

function ServiceCard({ service }) {

    console.log(service);
    return (
        <div
            className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
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
                            "
                        >
                            <Boxes size={22} />
                        </div>

                        <div>
                            <p className="text-lg font-bold capitalize tracking-tight text-slate-900">
                                { service.service }
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span
                                    className="
                                        rounded-full
                                        bg-white
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        text-slate-600
                                        border
                                        border-slate-200
                                    "
                                >
                                    { service.itemCount } bultos
                                </span>

                                
                                    <span
                                        className="
                                            rounded-full
                                            bg-indigo-50
                                            px-3
                                            py-1
                                            text-xs
                                            font-medium
                                            text-indigo-600
                                        "
                                    >
                                        Ref: 11221
                                    </span>
                                
                            </div>
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            Total servicio
                        </p>

                        <p
                            className="
                                text-3xl
                                font-black
                                tracking-tight
                                text-slate-900
                            "
                        >
                            {Number(service.total || 0).toFixed(2)}
                            <span className="ml-1 text-lg font-semibold text-slate-500">
                                €
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-5">

                {/* DESGLOSE */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <ReceiptText
                            size={16}
                            className="text-slate-400"
                        />

                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Desglose
                        </h4>
                    </div>

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-100
                            bg-slate-50/70
                            p-4
                        "
                    >
                        <ServiceBreakdown breakdown={service.breakdown} />
                    </div>
                </div>

                {/* INCIDENCIAS */}
                {service.incidents?.length > 0 && (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <AlertTriangle
                                size={16}
                                className="text-amber-500"
                            />

                            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Incidencias
                            </h4>
                        </div>

                        <div
                            className="
                                rounded-2xl
                                border
                                border-amber-100
                                bg-amber-50/60
                                p-4
                            "
                        >
                            <IncidentList incidents={service.incidents} />
                        </div>
                    </div>
                )}

                {/* BULTOS */}
                {service.packages?.length > 0 && (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Package
                                size={16}
                                className="text-slate-400"
                            />

                            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Bultos asociados
                            </h4>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {service.packages.map((pkg, index) => (
                                <div
                                    key={index}
                                    className="
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-4
                                    "
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-slate-800">
                                            Bulto #{index + 1}
                                        </p>

                                        {pkg.price && (
                                            <p className="text-sm font-bold text-indigo-600">
                                                {pkg.price} €
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-3 space-y-1 text-sm text-slate-500">
                                        {pkg.weight && (
                                            <p>
                                                Peso: <span className="font-medium text-slate-700">{pkg.weight} kg</span>
                                            </p>
                                        )}

                                        {pkg.measures && (
                                            <p>
                                                Medidas: <span className="font-medium text-slate-700">{pkg.measures}</span>
                                            </p>
                                        )}

                                        {pkg.reference && (
                                            <p>
                                                Ref: <span className="font-medium text-slate-700">{pkg.reference}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ServiceCard;