
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
            { resultRates && resultRates
                .sort((a, b) => (b.available - a.available))
                .map((agency, i) => (
                    <div
                        key={i}
                        className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-md rounded-2xl p-5 transition hover:shadow-lg"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold capitalize">
                                    { agency.agency }
                                </h3>
                                <p className="text-sm text-slate-500">
                                    { agency.zone || "" }
                                </p>
                            </div>

                            { agency.available ? (
                                <span className="text-green-600 text-sm font-medium">
                                    Disponible
                                </span>
                            ) : (
                                <span className="text-red-500 text-sm font-medium">
                                    No disponible
                                </span>
                            )}
                        </div>

                        { !agency.available && (
                            <div className="mt-3 text-sm text-red-400 bg-red-50 p-3 rounded-lg">
                                { agency.reason }
                            </div>
                        )}

                        { agency.available && agency.services && (
                            <div className="mt-4 space-y-3">

                            { agency.services.map((service, j) => (
                                <div
                                    key={ j }
                                    className="bg-white/80 border border-slate-200 rounded-xl p-4"
                                >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium capitalize">
                                            { service.service }
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xl font-bold text-indigo-600">
                                            { service.total } €
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={ () =>
                                        setOpen(open === `${i}-${j}` ? null : `${i}-${j}`)
                                    }
                                    className="text-xs text-indigo-500 mt-2 hover:underline"
                                >
                                    Ver desglose
                                </button>

                                {open === `${i}-${j}` && (
                                    <div className="mt-3 space-y-2 text-sm">

                                    { service.breakdown.map((b, k) => (
                                        <div
                                            key={k}
                                            className="flex justify-between bg-slate-50 p-2 rounded"
                                        >
                                        <div>
                                            <p className="font-medium">
                                                { b.type }
                                            </p>

                                            { b.palletType && (
                                                <p className="text-xs text-slate-500">
                                                    { b.palletType }
                                                </p>
                                            )}

                                            {b.totalWeight && (
                                            <p className="text-xs text-slate-500">
                                                { b.totalWeight } kg
                                            </p>
                                            )}
                                        </div>

                                        <div className="text-right">
                                            {b.unitPrice && (
                                            <p>
                                                € { b.unitPrice } x { b.quantity }
                                            </p>
                                            )}
                                            { b.price && <p>€ { b.price }</p> }
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                                )}
                                </div>
                            ))}
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
}