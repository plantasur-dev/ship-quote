
import { useState } from "react";

import { Alert } from "../../../ui";

import CompareRateSkeletonDetails from "./compare-rate-skeleton-details";

import AgencyCard from './agency-card/agency-card';

function CompareRateDetails({ isLoading, error, resultRates = [] }) {
    const [open, setOpen] = useState(null);

    if (isLoading) return <CompareRateSkeletonDetails />;

    if (error) {
        return <Alert message={error} type="warning" center />;
    }

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