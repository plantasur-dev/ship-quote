
import {
    Package,
    BadgeEuro,
} from "lucide-react";

import DimensionsItem from "../dimesions-item/dimesions-item";

function Breakdown({ breakdowns = [] }) {

    if (!breakdowns.length) return null;

    return (
        <div className="space-y-4">
            { breakdowns.map((breakdown, k) => (
                <div
                    key={ k }
                    className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200/70
                        bg-white/80
                        shadow-sm
                        backdrop-blur-xl
                        transition-all
                        duration-200
                        hover:border-indigo-200
                        hover:shadow-lg
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                            border-b
                            border-slate-100
                            to-white
                            px-6
                            py-2
                        "
                    >
                        <div className="flex items-start gap-4">
                            <div>
                                { breakdown.palletType ? (
                                    <div className="inline-flex items-center gap-2 px-4 py-2">
                                        <div
                                            className="
                                                flex
                                                h-8
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-gradient-to-br
                                                from-emerald-500
                                                to-teal-400
                                                text-white
                                                shadow-sm
                                            "
                                        >
                                            <Package size={ 16 } />
                                        </div>

                                        <div className="leading-tight">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                Tipo de pallet
                                            </p>

                                            <p className="text-sm font-bold tracking-tight text-slate-900">
                                                { breakdown.palletType }
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <h3
                                        className="
                                            mt-2
                                            text-base
                                            font-medium
                                            tracking-tight
                                            text-slate-600
                                        "
                                    >
                                        { breakdown.type } { breakdown?.excessWeight && 
                                            ( breakdown?.excessWeight + ` kg`) }
                                    </h3>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            { breakdown.unitPrice && (
                                <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
                                    { breakdown.unitPrice } €
                                    { breakdown.quantity && ` x ${ breakdown.quantity }`}
                                </p>
                            )}

                            { breakdown.price && (
                                <div className="mt-1 flex items-center justify-end gap-1">
                                    <BadgeEuro
                                        size={ 18 }
                                        className="text-indigo-500"
                                    />

                                    <p className="text-lg font-black tracking-tight text-indigo-500">
                                        { Number( breakdown.price || 0).toFixed(2) }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    { breakdown.items?.length > 0 && (
                        <div className="space-y-3 p-4">
                            { breakdown.items.map((item, idx) => (
                                <DimensionsItem 
                                    key={ idx }
                                    item={ item } 
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Breakdown;