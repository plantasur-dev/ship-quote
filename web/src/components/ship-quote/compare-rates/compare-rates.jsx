
import { useCompareRateResult } from "../../../hooks/use-compare-rate-result";

import CompareRateForm from "./compare-rate-form/compare-rate-form";
import CompareRateDetails from "./compare-rate-details/compare-rate-details";

function CompareRates() {

    const { 
        isLoading, 
        error, 
        resultRates, 
        handlerCalculateRates 
    } = useCompareRateResult();

    return (
        <>
            <section className="max-w-6xl mx-auto px-6 mt-10 grid md:grid-cols-2 gap-10 items-start">
                <div>
                    <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
                        Calcula la cotización de envíos
                    </h2>
                    <p className="mt-4 text-slate-600 text-lg">
                        Compara tarifas de múltiples transportistas.
                        Cayco, Tecum, Dascher...
                    </p>
                </div>
                
                <CompareRateForm
                    handlerCalculateRates={ handlerCalculateRates } 
                />
            </section>

            <section className="max-w-6xl mx-auto px-6 mt-10 gap-10 items-center">
                <CompareRateDetails
                    isLoading={ isLoading }
                    error={error} 
                    resultRates={ resultRates }
                />
            </section>
        </>
    );
}

export default CompareRates;