
import { FormProvider, useWatch } from "react-hook-form";

import {
    useCompareRateForm,
    useProvinces, 
    usePostalCode,
    useCountries, 
} from "../../../../hooks";

import CompareRateItemsDetails from './item-draft-details/item-draft-details';

import {
    SkeletonForm,
    CountrySelector,
    PostalCodeInput,
    ProvinceDisplay,
    ItemDraftForm,
    ItemDraftDetails,
    SubmitButton,
    ResetButton,
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
   
    if (isLoadingCountries || isLoadingProvinces) return <SkeletonForm />;
    
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
                className="relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl"
                onSubmit={ form.handleSubmit(handlerCalculateRates) }
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight">
                    Compare shipping rates
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                    Get the best shipping option instantly.
                    </p>
                </div>

                <div className="space-y-8">

                    <section className="space-y-5">
                        <CountrySelector 
                            countries={ countries } 
                            isLoadingCountries={ isLoadingCountries }
                        />

                        <PostalCodeInput />

                        <ProvinceDisplay 
                            provinces={ provinces }
                        />
                    </section>

                    <section className="space-y-5">
                        <ItemDraftForm 
                            onAddItem={ form.addItem }
                        />
                        
                        <ItemDraftDetails 
                            items={ form.items } 
                            onRemove={ form.removeItem }
                        />
                    </section>

                    <section className="flex gap-3 pt-2">
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                            <ResetButton />

                            <div className="flex-1">
                                <SubmitButton />
                            </div>
                        </div>
                    </section>

                </div>

            </form>

        </FormProvider>
    );
}

export default CompareRateForm;