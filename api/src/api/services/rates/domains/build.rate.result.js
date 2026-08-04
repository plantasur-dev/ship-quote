
import { fixedToN } from '../../../../lib/utils/rate.utils.js';

import { applyFuelSurcharge } from './pricing/fuel.surcharge.js';

export function buildRateComplete({
    agency,
    zone,
    services = []
}) {
    
    const available = services.some(service =>
        service.incidents?.length === 0
    );

    return {
        agency,
        available,
        zone,
        services
    }
};

export function buildRateResult({
    service,
    transportType,
    itemCount = 0,
    totalWeight = 0,
    concepts = [],
    incidents = [],
    agencySupplements
}) {

    const baseTotal = concepts.reduce(
        (sum, item) => sum + item.amount,
        0
    );

    const fuelAmount = fixedToN(
        applyFuelSurcharge(baseTotal, agencySupplements)
    );

    const finalConcepts = fuelAmount > 0
        ? [...concepts, buildConcept('FUEL_SURCHARGE', fuelAmount)]
        : concepts;

    return {
        service,
        transportType,
        itemCount,
        totalWeight,
        concepts: finalConcepts,
        incidents,
        total: fixedToN(baseTotal + fuelAmount)
    };
}

export function buildIncident(code, meta = {}) {
    return {
        code,
        meta
    };
}

export function buildConcept(code, amount, meta = {}) {
    return {
        code,
        amount: fixedToN(amount),
        meta
    };
}

export function buildParcelRate({
    serviceName,
    totalWeight,
    itemCount,
    concepts = [],
    incidents = [],
    agencySupplements
}) {

    return buildRateResult({
        service: serviceName,
        transportType: 'parcel',
        itemCount,
        totalWeight,
        concepts,
        incidents,
        agencySupplements
    });
}

export function buildApiErrorResult({
    agency,
    zone,
    transportType = 'unknown',
    error
}) {
    return buildRateComplete({
        agency,
        zone,

        services: [
            buildRateResult({
                service: 'API_ERROR',
                transportType,

                incidents: [
                    buildIncident(
                        'API_ERROR',
                        {
                            code: error?.status,
                            message: error?.message
                        }
                    )
                ]
            })
        ]
    });
}

export function buildStaticErrorResult({
    agency,
    zone,
    transportType = 'unknown',
    code,
    message = ''
}) {
    return buildRateComplete({
        agency,
        zone,

        services: [
            buildRateResult({
                service: code,
                transportType,

                incidents: [
                    buildIncident(
                        code,
                        {
                            message
                        }
                    )
                ]
            })
        ]
    });
}

export function buildRejectedServices(
    rejected, 
    transportType = 'pallet'
) {
    if (!rejected.length) return [];

    return [
        buildRateResult({
            service: 'REJECTED_PALLET',
            transportType,
            incidents: rejected.map(item => (
                buildIncident(
                    'PALLET_DIMENSION_REJECTED', 
                    item
                )
            ))
        })
    ];
}