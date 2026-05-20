
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
        <section
            className="
                mx-auto
                grid
                max-w-7xl
                gap-6
                px-6
                py-6

                xl:grid-cols-[45%_55%]
            "
        >
            <section className="xl:sticky xl:top-6">
                <CompareRateForm
                    handlerCalculateRates={ handlerCalculateRates }
                />
            </section>

            <section>
                <CompareRateDetails
                    isLoading={ isLoading }
                    error={ error }
                    resultRates={ resultRates }
                />
            </section>
        </section>
    );
}

export default CompareRates;