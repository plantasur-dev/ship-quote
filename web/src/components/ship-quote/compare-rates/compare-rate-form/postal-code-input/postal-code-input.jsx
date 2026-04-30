
import { useFormContext } from "react-hook-form";

import { validations } from '../../compare-rate-utils/validations-util';

function PostalCodeInput() {

    const { 
        register, 
        formState: { errors } 
    } = useFormContext();

    return (
        <div>
            <label className="text-sm text-slate-500">Código Postal</label>

            <input
                className={`w-full mt-1 px-4 py-3 rounded-lg bg-white/70 border focus:outline-none focus:ring-2 ${
                    errors?.destinationPostalCode
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-indigo-400"
                }`}
                placeholder="00000"
                { ...register('destinationPostalCode', validations?.destinationPostalCode) }
            />

            { errors?.destinationPostalCode && (
                <p className="mt-1 text-sm text-red-500">
                    { errors.destinationPostalCode.message }
                </p>
            )}
        </div>
    );
}

export default PostalCodeInput;