
import { useFormContext, useWatch } from "react-hook-form";

function ResetButton() {

    const { reset, control } = useFormContext();

    const items = useWatch({ control, name:'items' })

    return (
        <button
            type="button"

            onClick={() => reset()}

            disabled={ items.length === 0 }

            className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                text-sm
                font-medium
                text-slate-700
                shadow-sm
                transition-all
                duration-200

                cursor-pointer

                hover:border-slate-300
                hover:bg-slate-50

                active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:border-slate-200
                disabled:hover:bg-white
            "
        >
            Limpiar campos
        </button>
    );
}

export default ResetButton;