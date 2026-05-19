
import {
    findRate,
    round
} from '../../../../utils/rateEngine.util.js';

import { 
    validateParcelItem,
    enrichParcelItem,
    calculateParcelTotals,
    resolveParcelPrice
} from './parcelRateEngine.util.js';

import {
    buildStaticErrorResult,
    buildRateComplete, 
    buildParcelRate, 
    buildIncident 
} from '../../domains/buildRateResult.js';

import { presentRate } from '../../presenters/rate.presenter.js';

function calculateParcelRate({ 
    parcelItems,
    agencyRates,
    zone,
    agencySupplements
 }) {
    if (!parcelItems?.length) return [];

    const rate = findRate(agencyRates, {
        zoneName: zone.name,
        type: 'parcel'
    });

    if (!rate) return [];

    return rate.services.flatMap(service => {

        const { service: serviceName, surcharges, limits = {} } = service;

        const incidents = [];

        const validItems = parcelItems.map(item => {
            const incident = validateParcelItem(item, limits);

            if (incident) {
                incidents.push(
                    buildParcelRate({
                        serviceName,
                        itemCount: 1,
                        totalWeight: item.weight,
                        incidents: [incident]
                    })
                );

                return null;
            }

            return enrichParcelItem(item, surcharges);
        }).filter(Boolean);

        if (!validItems.length) return incidents;

        const {
            extraDimensionsCost,
            totalItemsWeight,
            volumetric
        } = calculateParcelTotals(validItems);

        const realWeight = round(totalItemsWeight);

        const volumetricWeight = Math.max(round(volumetric), realWeight);

        const totalWeight = Math.ceil(
            zone.pricingMode === 'weight_volume'
                ? volumetricWeight
                : realWeight
        );

        const pricing = resolveParcelPrice({
            totalWeight,
            extraDimensionsCost,
            service,
            agencySupplements
        });

        if (!pricing) {
            return [
                buildParcelRate({
                    serviceName,
                    itemCount: validItems.length,
                    totalWeight,
                    incidents: [
                        buildIncident(
                            'NO_RATE'
                        )
                    ]
                }),
                ...incidents
            ];
        }
        
        return [
            buildParcelRate({
                serviceName,
                itemCount: validItems.length,
                totalWeight,
                concepts: pricing.concepts
            }),
            ...incidents
        ];
    });
}

export function calculateParcel(params = {}) {
    const services = presentRate(calculateParcelRate({ ...params }));

    const { nameAgency, zone } = params;

    if (services.length === 0) {
        return buildStaticErrorResult({
            presentRate,
            agency: nameAgency,
            code: 'NO_RATE'
        });
    }

    return buildRateComplete({
        agency: nameAgency,
        zone: zone.name,
        services
    });
}