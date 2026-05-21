
import { round } from '../../../../lib/utils/rate.utils.js';

export function buildRateComplete({
    agency,
    zone = 'NACIONAL',
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
}) {

    return {
        service,
        transportType,
        itemCount,
        totalWeight,
        concepts,
        incidents,
        total: round(
            concepts.reduce(
                (sum, item) => sum + item.amount,
                0
            )
        )
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
        amount: round(amount),
        meta
    };
}

export function buildParcelRate({
    serviceName,
    totalWeight,
    itemCount,
    concepts = [],
    incidents = []
}) {

    return buildRateResult({
        service: serviceName,
        transportType: 'parcel',
        itemCount,
        totalWeight,
        concepts,
        incidents
    });
}

export function buildApiErrorResult({
    agency,
    transportType = 'unknown',
    error,
    presentRate
}) {
    return buildRateComplete({
        agency,

        services: presentRate([
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
        ])
    });
}

export function buildStaticErrorResult({
    presentRate,
    agency,
    transportType = 'unknown',
    code,
    message = ''
}) {
    return buildRateComplete({
        agency,

        services: presentRate([
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
        ])
    });
}