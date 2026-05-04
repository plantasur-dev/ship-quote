
function CompareRateSekeletonDetails() {
    return (
        <div className="mx-auto mt-10 space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white/70 border border-white/60 shadow-md rounded-2xl p-5"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded" />
                            <div className="h-3 w-20 bg-slate-200 rounded" />
                        </div>
                        <div className="h-3 w-20 bg-slate-200 rounded" />
                    </div>

                    {/* Services */}
                    <div className="mt-4 space-y-3">
                        {Array.from({ length: 2 }).map((_, j) => (
                            <div
                                key={j}
                                className="bg-white/80 border border-slate-200 rounded-xl p-4 space-y-3"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-28 bg-slate-200 rounded" />
                                    <div className="h-5 w-16 bg-slate-200 rounded" />
                                </div>

                                <div className="h-3 w-24 bg-slate-200 rounded" />

                                {/* Breakdown fake */}
                                <div className="space-y-2">
                                    {Array.from({ length: 2 }).map((_, k) => (
                                        <div
                                            key={k}
                                            className="flex justify-between bg-slate-100 p-2 rounded"
                                        >
                                            <div className="space-y-1">
                                                <div className="h-3 w-24 bg-slate-200 rounded" />
                                                <div className="h-2 w-16 bg-slate-200 rounded" />
                                            </div>
                                            <div className="h-3 w-16 bg-slate-200 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CompareRateSekeletonDetails;