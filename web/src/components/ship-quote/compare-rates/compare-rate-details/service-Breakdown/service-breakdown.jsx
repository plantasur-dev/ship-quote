
function ServiceBreakdown({ breakdown = [] }) {
    if (!breakdown.length) return null;

    return (
        <div className="space-y-3">
            {breakdown.map((b, k) => (
                <div
                    key={k}
                    className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"
                >
                    <div className="flex-1">
                        <p className="font-medium capitalize text-slate-800">
                            {b.type}
                        </p>

                        {b.palletType && (
                            <p className="mt-1 text-xs text-slate-500">
                                {b.palletType}
                            </p>
                        )}

                        {b.items?.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {b.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600"
                                    >
                                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                                            <span>Tipo: {item.typeServices}</span>
                                            <span>Peso: {item.weight} kg</span>
                                            <span>Largo: {item.large}</span>
                                            <span>Ancho: {item.width}</span>
                                            <span>Alto: {item.height}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="min-w-[90px] text-right">
                        {b.unitPrice && (
                            <p className="text-sm text-slate-500">
                                {b.unitPrice} €{b.quantity && ` x ${b.quantity}`}
                            </p>
                        )}

                        {b.price && (
                            <p className="font-semibold text-indigo-600">
                                {b.price} €
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ServiceBreakdown;