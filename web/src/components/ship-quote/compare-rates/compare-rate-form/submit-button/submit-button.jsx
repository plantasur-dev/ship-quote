
import { useFormContext, useWatch } from "react-hook-form";

import { BounceLoader } from "react-spinners";

function SubmitButton() {

    const { 
        control, 
        formState: { isSubmitting } 
    } = useFormContext();

    const items = useWatch({ control, name: 'items' });

   return (
        <button
            type="submit"
            disabled={items.length === 0 || isSubmitting}
            className="
                group
                relative
                inline-flex
                h-12
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                
                cursor-pointer

                bg-slate-900
                text-white

                shadow-sm
                shadow-slate-900/10

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-slate-800
                hover:shadow-lg
                hover:shadow-slate-900/20

                active:scale-[0.99]

                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:translate-y-0
                disabled:hover:shadow-sm
            "
        >
            <span
                className="
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-white/30
                    to-transparent
                    opacity-60
                "
            />

            {isSubmitting ? (
                <div className="flex items-center gap-3 m-4">
                    <BounceLoader color="#ffffff" size={18} />
                    <span className="text-sm font-medium">
                        Calculando rutas...
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-wide m-6">
                        Calcular cotización
                    </span>
                </div>
            )}
        </button>
    );
}

export default SubmitButton;