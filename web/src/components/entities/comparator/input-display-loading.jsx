
import { ClipLoader } from "react-spinners";

function DisplayLoading() {
    return (
        <div className="space-y-2">
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

export default DisplayLoading;