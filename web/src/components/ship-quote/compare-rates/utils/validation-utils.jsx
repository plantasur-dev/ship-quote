
import { validate } from 'postal-codes-js';

export const createValidations = (getValues) => ({
    destinationPostalCode: {
        required: "Postal Code is required",
    
        validate: (postalCode) => {
            const countryCode = getValues('countryCode');
            
            return validate(countryCode, postalCode);
        }
    }
});