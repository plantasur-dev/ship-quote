
import { ClipLoader } from "react-spinners";

function ProvinceLoading() {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
                Provincia
            </label>

            <div
                className="
                    flex
                    h-12
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50/80
                "
            >
                <ClipLoader size={ 18 } color="#64748b" />
            </div>
        </div>
    );
}

export default ProvinceLoading;