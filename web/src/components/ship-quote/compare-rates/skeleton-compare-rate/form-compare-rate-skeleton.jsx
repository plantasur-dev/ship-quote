
function FormCompareRateSkeleton() {
    return (
        <>
            {/* LEFT */}
            <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-gray-200 rounded w-4/5"></div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* RIGHT */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/70 shadow-xl rounded-2xl p-6 space-y-5">

                {/* País */}
                <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
                </div>

                {/* CP */}
                <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
                </div>

                {/* Provincia */}
                <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
                </div>

                <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
                </div>

                {/* Dimensiones */}
                <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-56 bg-gray-200 rounded"></div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* Botón */}
                <div className="h-12 bg-gray-300 rounded-xl"></div>

            </div>
        </>
    );
}

export default FormCompareRateSkeleton;