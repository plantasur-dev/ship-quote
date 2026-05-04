
import { useFormContext, useWatch } from "react-hook-form";

function ResetButton() {

    const { reset, control } = useFormContext();

    const items = useWatch({ control, name:'items' })

    return(
        <button 
            onClick={ () => reset() }
            disabled={ items.length === 0 }
            className={`
                py-3 
                text-sm 
                font-medium 
                cursor-pointer
                ${ items.length 
                    ? `text-indigo-500 hover:text-shadow-2xs` 
                    : `text-indigo-300`
                }
            `}>
            Limpiar campos
        </button>
    );
}

export default ResetButton;