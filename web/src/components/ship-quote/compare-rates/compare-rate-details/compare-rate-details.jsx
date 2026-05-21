import { useState } from "react";

import { Alert } from "../../../ui";

import CompareRateSekeletonDetails from './compare-rate-skeleton-details';

export default function CompareRateDetails({ isLoading, error, resultRates = [] }) {
    const [open, setOpen] = useState(null);
    
    if (isLoading) return <CompareRateSekeletonDetails />;

    if (error) {
        return <Alert 
            message={ error } 
            type="warning" 
            center={ true } 
        />;
    } 
        
    return (
    <div className="mx-auto mt-10 space-y-4">
        {resultRates &&
            resultRates
                .sort((a, b) => Number(b.available) - Number(a.available))
                .map((agency, i) => (
                    <div
                        key={i}
                        className="
                            rounded-2xl
                            border
                            border-white/60
                            bg-white/70
                            p-5
                            shadow-md
                            backdrop-blur-xl
                            transition
                            hover:shadow-lg
                        "
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold capitalize">
                                    {agency.agency}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {agency.zone || ""}
                                </p>
                            </div>

                            {agency.available ? (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                    Disponible
                                </span>
                            ) : (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                    No disponible
                                </span>
                            )}
                        </div>

                        { agency.services?.length > 0 && (
                            <div className="mt-5 space-y-4">
                                { agency.services.map((service, j) => (
                                    <div
                                        key={ j }
                                        className="rounded-2xl border border-slate-200 bg-white/80 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-semibold capitalize text-slate-800">
                                                    { service.service }
                                                </p>

                                                { service.itemCount > 0 && (
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Total bultos:{" "}
                                                        { service.itemCount }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-indigo-600">
                                                    { service.total } €
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setOpen(
                                                    open === `${i}-${j}`
                                                        ? null
                                                        : `${i}-${j}`
                                                )
                                            }
                                            className="
                                                mt-3
                                                text-sm
                                                font-medium
                                                text-indigo-500
                                                hover:text-indigo-700
                                            "
                                        >
                                            {open === `${i}-${j}`
                                                ? "Ocultar desglose"
                                                : "Ver desglose"}
                                        </button>

                                        {open === `${i}-${j}` && (
                                            <div className="mt-4 space-y-3">
                                                { service.breakdown?.length > 0 &&
                                                    service.breakdown.map(
                                                        (b, k) => (
                                                            <div
                                                                key={k}
                                                                className="
                                                                    flex
                                                                    justify-between
                                                                    gap-4
                                                                    rounded-xl
                                                                    bg-slate-50
                                                                    p-3
                                                                "
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="font-medium capitalize text-slate-800">
                                                                        {b.type}
                                                                    </p>

                                                                    {b.palletType && (
                                                                        <p className="mt-1 text-xs text-slate-500">
                                                                            {
                                                                                b.palletType
                                                                            }
                                                                        </p>
                                                                    )}

                                                                    {b.items
                                                                        ?.length >
                                                                        0 && (
                                                                        <div className="mt-3 space-y-2">
                                                                            {b.items.map(
                                                                                (
                                                                                    item,
                                                                                    idx
                                                                                ) => (
                                                                                    <div
                                                                                        key={ idx }
                                                                                        className="
                                                                                            rounded-lg
                                                                                            border
                                                                                            border-slate-200
                                                                                            bg-white
                                                                                            p-3
                                                                                            text-xs
                                                                                            text-slate-600
                                                                                        "
                                                                                    >
                                                                                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                                                            <span>
                                                                                                <span className="font-medium text-slate-700">
                                                                                                    Tipo:
                                                                                                </span>{" "}
                                                                                                {
                                                                                                    item.typeServices
                                                                                                }
                                                                                            </span>

                                                                                            <span>
                                                                                                <span className="font-medium text-slate-700">
                                                                                                    Peso:
                                                                                                </span>{" "}
                                                                                                {
                                                                                                    item.weight
                                                                                                }{" "}
                                                                                                kg
                                                                                            </span>

                                                                                            <span>
                                                                                                <span className="font-medium text-slate-700">
                                                                                                    Largo:
                                                                                                </span>{" "}
                                                                                                {
                                                                                                    item.large
                                                                                                }
                                                                                            </span>

                                                                                            <span>
                                                                                                <span className="font-medium text-slate-700">
                                                                                                    Ancho:
                                                                                                </span>{" "}
                                                                                                {
                                                                                                    item.width
                                                                                                }
                                                                                            </span>

                                                                                            <span>
                                                                                                <span className="font-medium text-slate-700">
                                                                                                    Alto:
                                                                                                </span>{" "}
                                                                                                {
                                                                                                    item.height
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="min-w-[90px] text-right">
                                                                    {b.unitPrice && (
                                                                        <p className="text-sm text-slate-500">
                                                                            {
                                                                                b.unitPrice
                                                                            }{" "}
                                                                            €
                                                                            {b.quantity &&
                                                                                ` x ${b.quantity}`}
                                                                        </p>
                                                                    )}

                                                                    {b.price && (
                                                                        <p className="font-semibold text-indigo-600">
                                                                            {
                                                                                b.price
                                                                            }{" "}
                                                                            €
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}

                                                {service.incidents?.length >
                                                    0 && (
                                                    <div className="space-y-2">
                                                        { service.incidents.map(
                                                            (
                                                                incident,
                                                                a
                                                            ) => (
                                                                <div
                                                                    key={a}
                                                                    className="
                                                                        rounded-xl
                                                                        border
                                                                        border-red-200
                                                                        bg-red-50
                                                                        p-3
                                                                        text-red-700
                                                                    "
                                                                >
                                                                    <p className="font-medium">
                                                                        {
                                                                            incident.type
                                                                        }
                                                                    </p>

                                                                    { incident.message && (
                                                                        <p className="mt-1 text-sm">
                                                                            {
                                                                                incident.message
                                                                            }
                                                                        </p>
                                                                    )}

                                                                    { incident?.typeServices && 
                                                                    
                                                                    
                                                                    <div
                                                                        className="
                                                                            rounded-lg
                                                                            border
                                                                            border-slate-200
                                                                            bg-white
                                                                            p-3
                                                                            text-xs
                                                                            text-slate-600
                                                                        "
                                                                    >
                                                                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                                            <span>
                                                                                <span className="font-medium text-slate-700">
                                                                                    Tipo:
                                                                                </span>{" "}
                                                                                {
                                                                                    incident?.typeServices
                                                                                }
                                                                            </span>

                                                                            <span>
                                                                                <span className="font-medium text-slate-700">
                                                                                    Peso:
                                                                                </span>{" "}
                                                                                {
                                                                                    incident?.weight
                                                                                }{" "}
                                                                                kg
                                                                            </span>

                                                                            <span>
                                                                                <span className="font-medium text-slate-700">
                                                                                    Largo:
                                                                                </span>{" "}
                                                                                {
                                                                                    incident?.large
                                                                                }
                                                                            </span>

                                                                            <span>
                                                                                <span className="font-medium text-slate-700">
                                                                                    Ancho:
                                                                                </span>{" "}
                                                                                {
                                                                                    incident?.width
                                                                                }
                                                                            </span>

                                                                            <span>
                                                                                <span className="font-medium text-slate-700">
                                                                                    Alto:
                                                                                </span>{" "}
                                                                                {
                                                                                    incident?.height
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    }
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}