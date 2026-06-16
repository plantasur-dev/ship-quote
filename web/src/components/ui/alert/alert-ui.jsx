
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

const variants = {
    error: {
        icon: AlertCircle,
        className:
            "border-red-200 bg-red-50 text-red-800",
        iconColor: "text-red-500",
    },
    success: {
        icon: CheckCircle2,
        className:
            "border-green-200 bg-green-50 text-green-700",
        iconColor: "text-green-500",
    },
    warning: {
        icon: TriangleAlert,
        className:
            "border-amber-200 bg-amber-50 text-amber-800",
        iconColor: "text-amber-500",
    },
    info: {
        icon: Info,
        className:
            "border-sky-200 bg-sky-50 text-sky-700",
        iconColor: "text-sky-500",
    },
};

const Alert = ({ message, type = "info", center = false }) => {
    
    const config = variants[type] ?? variants.info;
    const Icon = config.icon;

    const isError = type === "error";

    return (
        <div
            role={ isError ? "alert" : "status" }
            aria-live={ isError ? "assertive" : "polite" }
            className={`
                flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm
                ${ config.className }
                ${ center ? "justify-center text-center" : "" }
            `}
        >
            <Icon
                className={ `mt-0.5 h-4 w-4 ${ config.iconColor }` }
            />

            <span className="text-sm font-medium">
                { message }
            </span>
        </div>
    );
};

export default Alert;