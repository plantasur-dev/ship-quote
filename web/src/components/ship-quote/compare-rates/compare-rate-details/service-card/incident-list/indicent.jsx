
import DimensionsItem from "../dimesions-item/dimesions-item";

function Incident({ incidents = [] }) {

    if (!incidents.length) return null;

    return (
        <div className="space-y-2">
            { incidents.map((incident, i) => (
                <div
                    key={i}
                    className="
                        rounded-xl 
                        border 
                        border-amber-100/50 
                        bg-gradient-to-r 
                        from-amber-50
                        to-orange-40/70
                        p-3
                        text-amber-600
                        shadow-sm
                    "
                >
                    <div className="mb-1 font-medium">
                        <div className="space-y-2">
                            <p className="font-semibold text-red-900">
                                { incident.type }
                            </p>

                            <div className="flex flex-wrap gap-2">
                                { incident?.maxSumDimensions && (
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            rounded-xl
                                            border
                                            border-red-200
                                            bg-red-50
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-red-700
                                        "
                                    >
                                        Máx: { incident.maxSumDimensions } cm
                                    </span>
                                )}

                                { incident?.currentDimensions && (
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            rounded-xl
                                            border
                                            border-orange-200
                                            bg-orange-50
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-orange-700
                                        "
                                    >
                                        Actual: { incident.currentDimensions } cm
                                    </span>
                                )}

                                { incident?.maxLength && (
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            rounded-xl
                                            border
                                            border-red-200
                                            bg-red-50
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-red-700
                                        "
                                    >
                                        Máx: { incident.maxLength } cm
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    { incident.message && (
                        <p className="mt-1 text-sm">{ incident.message }</p>
                    )}

                    { incident.typeServices && (
                        <DimensionsItem item={ incident } />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Incident;