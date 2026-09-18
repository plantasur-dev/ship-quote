
import { ClipLoader } from "react-spinners";

function DisplayLoading() {
    return (
        <div className="
            flex 
            h-12 
            items-center
            justify-center 
            rounded-2xl 
            border 
            border-slate-200 
            bg-white 
            px-4 
            text-sm 
            text-slate-900 
            shadow-sm"
        >
            <ClipLoader size={ 18 } color="#64748b" />
        </div>
    );
}

export default DisplayLoading;