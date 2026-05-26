
import { Ruler, Weight } from "lucide-react";

function DimensionsItem({ item }) {

    return (
        <div
            className="
                group
                border-b
                border-slate-200/80
                bg-gradient-to-r
                from-white
                to-slate-50/70
                p-2
                transition-all
                duration-200
                hover:border-indigo-200
                hover:shadow-sm
            "
        >
            <div className="flex flex-wrap items-center gap-2">
                <div
                    className="
                        inline-flex
                        items-center
                        rounded-xl
                        bg-indigo-50
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        capitalize
                        text-slate-900
                    "
                >
                    { item.typeServices }
                </div>

                <div
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-xl
                        bg-slate-100
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-slate-700
                    "
                >
                    <Weight size={ 14 } className="text-slate-500" />

                    <span>{ item.weight } kg</span>
                </div>

                <div
                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-xl
                        bg-slate-100
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-slate-700
                    "
                >
                    <Ruler size={ 14 } className="text-slate-500" />

                    <span className="text-xs text-slate-400">
                        Lg. <span className="text-base text-slate-600">{ item.large }</span> cm
                        <span className="mx-1">×</span>
                        An. <span className="text-base text-slate-600">{ item.width }</span> cm
                        <span className="mx-1">×</span>
                        Al. <span className="text-base text-slate-600">{ item.height }</span> cm
                    </span>
                </div>
            </div>
        </div>
    );
}

export default DimensionsItem;