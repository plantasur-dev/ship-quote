
import { useFormContext, useWatch } from "react-hook-form";

function SubmitButton() {

    const { control, formState: { isSubmitting } } = useFormContext();

    const items = useWatch({ control, name: "items" });

    return (
        <button 
            type="submit"
            disabled={ items.length === 0 }
            className={`w-full 
                py-3 
                rounded-xl 
                bg-indigo-600 
                text-white 
                font-semibold 
                hover:bg-indigo-700 
                transition 
                cursor-pointer
            `}
        >
            { isSubmitting ? "Consultando cotización..." : "Obtener cotización" }
        </button>
    );
}

export default SubmitButton;