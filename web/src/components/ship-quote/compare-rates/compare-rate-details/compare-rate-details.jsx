
import { useState } from "react";

import { Alert } from "../../../ui";

import CompareRateSkeletonDetails from "./compare-rate-skeleton-details";

import AgencyCard from './agency-card/agency-card';

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="text-7xl mb-6">🗺️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Sin cotizaciones todavía
            </h2>
            <p className="text-gray-500 max-w-md">
                Comienza una nueva cotización para comparar las mejores tarifas
                de envío entre nuestros proveedores. Consulta precios y elige la opción que mejor se adapte
                a tu envío.
            </p>
        </div>
    );
}

function CompareRateDetails({ isLoading, error, resultRates = [] }) {
    const [open, setOpen] = useState(null);

    if (isLoading) return <CompareRateSkeletonDetails />;
    
    if (error) {
        const { type, message } = error;

        return <Alert 
            message={ message } 
            type={ type } 
            center={ true } 
        />;
    }

    if (!resultRates.length) return EmptyState();

    const toggle = (id) => {
        setOpen((prev) => (prev === id ? null : id));
    };

    return (
        <div className="mx-auto mt-10 space-y-4">
            { resultRates
                .sort((a, b) => Number(b.available) - Number(a.available))
                .map((agency, i) => (
                    <AgencyCard
                        key={ agency.agency + i }
                        agency={ agency }
                        index={ i }
                        open={ open }
                        onToggle={ toggle }
                    />
                ))
            }
        </div>
    );
}

export default CompareRateDetails;