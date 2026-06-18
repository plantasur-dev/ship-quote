
import { useFormContext } from "react-hook-form";

import { createValidations } from '../../utils/validation-utils';

function PostalCodeInput({ isLoadingProvinces }) {

    const { 
        register,
        getValues,
        formState: { errors } 
    } = useFormContext();
    
    const validations = createValidations(getValues);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
                Código postal
            </label>

            <input
                placeholder="00000"

                placeholder={
                    isLoadingProvinces
                        ? "Cargando provincias..."
                        : "Buscar provincia..."
                }

                disabled={ isLoadingProvinces }

                { ...register(
                    'destinationPostalCode',
                    validations?.destinationPostalCode
                )}

                className={`
                    h-12
                    w-full
                    rounded-2xl
                    border
                    bg-white/80
                    px-4
                    text-sm
                    text-slate-900
                    shadow-sm
                    outline-none
                    transition-all
                    duration-200

                    placeholder:text-slate-400

                    ${
                        errors?.destinationPostalCode
                            ? `
                                border-red-300
                                focus:border-red-400
                                focus:ring-4
                                focus:ring-red-400/10
                            `
                            : `
                                border-slate-200
                                hover:border-slate-300
                                focus:border-indigo-500
                                focus:ring-4
                                focus:ring-indigo-500/10
                            `
                    }
                `}
            />

            { errors?.destinationPostalCode && (
                <p className="text-sm text-red-500">
                    { errors.destinationPostalCode.message }
                </p>
            )}
        </div>
    );
}

export default PostalCodeInput;