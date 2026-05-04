
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
        type='submit'
        disabled={ items.length === 0 || isSubmitting }
        className='w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold transition cursor-pointer
                   hover:bg-indigo-700
                   disabled:opacity-50
                   disabled:hover:bg-indigo-600'
    >
        { isSubmitting 
            ?   <div className='flex items-center justify-center h-5'>
                    <BounceLoader color='#ffffff' size={18} />
                    <span className="ml-1">Consultando cotización...</span>
                </div>
            :   'Obtener cotización' }
    </button>
);
}

export default SubmitButton;