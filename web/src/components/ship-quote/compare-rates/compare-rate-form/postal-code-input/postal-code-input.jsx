
import { MapPinOff, MapPinSearch } from 'lucide-react';

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

            <div className={`
                ${ inputStyle }

                ${ errors?.destinationPostalCode 
                    ? `
                        border-red-300

                        hover:border-red-300

                        focus-within:border-red-300
                        focus-within:ring-2
                        focus-within:ring-red-200/70
                        focus-within:ring-offset-red-50
                    ` 
                    : `
                        border-slate-200

                        hover:border-slate-300 
                        
                        focus-within:border-indigo-300
                        focus-within:ring-2
                        focus-within:ring-indigo-200/70
                        focus-within:ring-offset-indigo-50
                    `
                }
            `} >
                <MapPinSearch 
                    size={ 18 } 
                    className="shrink-0 text-indigo-400"
                />
                
                <input
                    className="h-full min-w-0 w-full outline-none"

                    placeholder={
                        isLoadingProvinces
                            ? "Cargando provincias..."
                            : "Ej. 23400"
                    }

                    disabled={ isLoadingProvinces }

                    { ...register(
                        'destinationPostalCode',
                        validations?.destinationPostalCode
                    )}
                />
            </div>

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