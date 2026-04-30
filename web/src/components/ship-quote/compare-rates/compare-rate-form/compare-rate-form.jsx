
import { FormProvider, useWatch } from "react-hook-form";

import {
    useCompareRateForm,
    useProvinces, 
    usePostalCode,
    useCountries, 
} from "../../../../hooks";

import CompareRateSkeletonForm from '../compare-rate-skeleton/compare-rate-skeleton-form';

import CompareRateItemsDetails from '../compare-rate-items-details/compare-rate-items-details';

import { 
    CountrySelector,
    PostalCodeInput,
    ProvinceDisplay,
    ItemDraftForm,
    SubmitButton,
    ErrorsForm
} from './.'


function CompareRateForm({ handlerCalculateRates }) {

    const form = useCompareRateForm();

    const countryCode = useWatch({ control: form.control, name: 'countryCode' });
        
    const { isLoadingCountries, countriesError, countries } = useCountries();
    const { isLoadingProvinces, provincesError, provinces } = useProvinces(countryCode);
    
    usePostalCode({
        watchPostal: useWatch({ control: form.control, name: 'destinationPostalCode' }),
        provinces,
        setValue: form.setValue
    });
   
    if (isLoadingCountries || isLoadingProvinces) return <CompareRateSkeletonForm />;
    
    const externalErrors = {
        ...(countriesError ? { countries: countriesError } : {}),
        ...(provincesError ? { provinces: provincesError } : {})
    };

    const allServerErrors = {
        ...form.serverErrors,
        ...externalErrors
    };

    return (
        <FormProvider { ...form }>
            <form 
                onSubmit={ form.handleSubmit(handlerCalculateRates) }
                className="backdrop-blur-xl bg-white/60 border border-white/70 shadow-xl rounded-2xl p-6"
            >
                <ErrorsForm serverErrors={ allServerErrors } />

                <div className="space-y-4">
                    <CountrySelector
                        countries={ countries } 
                        isLoadingCountries={ isLoadingCountries }
                    />

                    <PostalCodeInput />
                    
                    <ProvinceDisplay 
                        provinces={ provinces }
                    />

                    <ItemDraftForm
                        onAddItem={ form.addItem }
                    />

                    <CompareRateItemsDetails 
                        items={ form.items } 
                        onRemove={ form.removeItem }
                    />

                    <SubmitButton />

                </div>
            </form>
        </FormProvider>
    );
}

export default CompareRateForm;