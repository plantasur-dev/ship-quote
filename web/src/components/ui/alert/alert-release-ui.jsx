
import { Rocket, X } from "lucide-react";
import { useReleases } from "../../../hooks";

const AlertRelease = () => {

    const { release, showNotification, handleCloseDismissNotification } = useReleases();

    if (!release || !showNotification) return null;

    return (
        <div
            className="
                fixed
                bottom-6
                right-6
                z-[9999]
                w-[420px]
                max-w-[calc(100vw-2rem)]
                animate-slide-up
            "
        >
            <div
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    ring-1
                    ring-black/5
                "
            >
                <div
                    className="
                        h-1
                        bg-gradient-to-r
                        from-indigo-500
                        via-purple-500
                        to-pink-500
                    "
                />

                <div className="p-5">

                    <button
                        onClick={ handleCloseDismissNotification }
                        className="
                            absolute
                            right-3
                            top-3
                            rounded-lg
                            p-1
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700

                            cursor-pointer
                        "
                    >
                        <X size={ 18 } />
                    </button>


                    <div className="flex gap-4">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-indigo-100
                            "
                        >
                            <Rocket className="h-6 w-6 text-indigo-600" />
                        </div>


                        <div className="flex-1">
                            <div className="flex items-center gap-2 pr-6">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Nueva actualización
                                </h3>

                                <span
                                    className="
                                        rounded-full
                                        bg-indigo-50
                                        px-2
                                        py-0.5
                                        text-xs
                                        font-semibold
                                        text-indigo-600
                                    "
                                >
                                    { release.target.toUpperCase() } v{ release.version }
                                </span>
                            </div>


                            <p className="mt-2 font-medium text-slate-800">
                                { release.title }
                            </p>


                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                { release.message }
                            </p>

                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    onClick={ handleCloseDismissNotification }
                                    className="
                                        rounded-lg
                                        bg-indigo-600
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-indigo-700
                                        active:scale-95

                                        cursor-pointer
                                    "
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertRelease;