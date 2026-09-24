
import { MapPinOff } from 'lucide-react';

import { useFormContext } from "react-hook-form";

import { inputStyle } from "../item-draft-form/item-draft-form-styles";

import { createValidations } from '../../utils/validation-utils';


function PostalCodeInput({ isLoadingProvinces }) {

    const { 
        register,
        getValues,
        formState: { errors } 
    } = useFormContext();
    
    const validations = createValidations(getValues);

    return (
        <div>
            <label className="inline-block ml-2 mb-2 text-sm font-medium text-slate-700">
                Código postal
            </label>

            <input
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
                    ${ inputStyle }
                    ${
                        errors?.destinationPostalCode
                            ? `
                                border-red-300

                                hover:border-red-300

                                focus:border-red-300
                                focus:ring-2
                                focus:ring-red-200/70
                                focus:ring-offset-1
                                focus:ring-offset-red-50 
                            `
                            : `
                                border-slate-200

                                hover:border-slate-300
                            `
                    }
                `}
            />

            { errors?.destinationPostalCode && (
                <p className="ml-4 mt-2 flex items-center gap-1 text-sm text-red-500">
                    <MapPinOff size={ 12 }/>
                    { errors.destinationPostalCode.message }
                </p>
            )}
        </div>
    );
}

export default PostalCodeInput;