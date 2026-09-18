
import { 
    FormProvider, 
    useWatch 
} from "react-hook-form";

import {
    useCompareRateForm,
    useCountries,
    useProvinces, 
} from "../../../../hooks";

import {
    SkeletonForm,
    CountrySelector,
    CountryDisplay,
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

    const countryCode = useWatch({ 
        control: form.control, 
        name: 'countryCode' 
    });

    const postalCode = useWatch({ 
        control: form.control, 
        name: "destinationPostalCode" 
    });
      
    const { isLoadingCountries, countriesError, countries } = useCountries();
    const { isLoadingProvinces, provinces } = useProvinces(countryCode);
    
    if (isLoadingCountries) return <SkeletonForm />;
    
    const externalErrors = {
        ...(countriesError ? { countries: countriesError } : {}),
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
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

                <div className="space-y-8">

                    <section className="space-y-3">
                        <ErrorsForm 
                            serverErrors={ allServerErrors } 
                        />

                        <CountrySelector 
                            countries={ countries } 
                            isLoadingCountries={ isLoadingCountries }
                        />

                        <PostalCodeInput 
                            isLoadingProvinces={ isLoadingProvinces }
                        />

                        <div className="flex gap-6">
                            <div className="flex-1">
                                <CountryDisplay 
                                    countries={ countries } 
                                />
                            </div>

                            <div className="flex-1">
                                <ProvinceDisplay 
                                    provinces={ provinces }
                                    postalCode={ postalCode }
                                    countryCode={ countryCode }
                                />
                            </div>
                        </div>

                    </section>

                    <section className="space-y-8">
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