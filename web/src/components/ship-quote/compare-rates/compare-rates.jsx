
import { useState } from "react";

import FormCompareRate from "./form-compare-rate/form-compare-rate";
import DetailsCompareRates from "./details-compare-rate/details-compare-rates";

import { compareRate } from "../../../services/api-services";

function CompareRates() {

    const [data, setData] = useState({
        destinationPostalCode: '',
        province: '',
        items: []
    });

    const [resultRates, setResultRates] = useState([]);

    const handlecalculatePallet = async () => {
        try {
            const rates = await compareRate(data);
            setResultRates(rates);
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <>
            <section className="max-w-6xl mx-auto px-6 mt-10 grid md:grid-cols-2 gap-10 items-start">
                <FormCompareRate 
                    data={ data } 
                    setData={ setData }
                    handlecalculatePallet={ handlecalculatePallet } 
                />
            </section>

            <section className="max-w-6xl mx-auto px-6 mt-10 gap-10 items-center">
               <DetailsCompareRates 
                    resultRates={ resultRates }
               />
            </section>
        </>
    );
}

export default CompareRates;