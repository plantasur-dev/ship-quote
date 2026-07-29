
import {
    fixedToN
} from '../../../../../lib/utils/rate.utils.js';

import {
    PRICING_MODES
} from '../../../../../lib/constants/index.js';

import {
    validateParcelItem,
    enrichParcelItem,
    calculateParcelTotals
} from '../../domains/parcel/parcel.rules.js';

import { 
    resolveParcelPrice
} from './parcel.rate.utils.js';

import {
    buildStaticErrorResult,
    buildRateComplete, 
    buildParcelRate, 
    buildIncident 
} from '../../domains/build.rate.result.js';

export function calculateParcelRate({ 
    parcelItems,
    agencyRates,
    zone,
    agencySupplements
 }) {
    if (!parcelItems?.length) return [];
    
    const rate = agencyRates.get(`${zone.calculationMode}|${zone.name}|none`);
    if (!rate) return [];

    const pricingMode = zone.pricingMode.type;

    return rate.services.flatMap(service => {

        const { service: serviceName, surcharges, limits = {} } = service;

        const incidents = [];

        const validItems = parcelItems.map(item => {
            const incident = validateParcelItem(item, limits);

            if (incident) {
                incidents.push(
                    buildParcelRate({
                        serviceName,
                        itemCount: 0,
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

        const realWeight = fixedToN(totalItemsWeight);

        const volumetricWeight = Math.max(fixedToN(volumetric), realWeight);

        const weightByPricingMode = {
            [PRICING_MODES.REAL_WEIGHT]: realWeight,
            [PRICING_MODES.WEIGHT_VOLUME]: volumetricWeight
        };
        
        const selectedWeight = weightByPricingMode[pricingMode];
          
        if (selectedWeight === undefined) {
            return [
                buildParcelRate({
                    serviceName,
                    itemCount: 0,
                    totalWeight: 0,
                    incidents: [
                        buildIncident(
                            'CALCULATION_ERROR'
                        )
                    ]
                }),
                ...incidents
            ];
        }

        const totalWeight = Math.ceil(selectedWeight);

        const itemCount = validItems.length;

        const pricing = resolveParcelPrice({
            totalWeight,
            extraDimensionsCost,
            itemCount,
            service
        });

        if (!pricing) {
            return [
                buildParcelRate({
                    serviceName,
                    itemCount,
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
                itemCount,
                totalWeight,
                concepts: pricing.concepts,
                agencySupplements
            }),
            ...incidents
        ];
    });
}

export function calculateParcel(params = {}) {
    const services = calculateParcelRate(params);

    const { nameAgency, zone } = params;

    if (services.length === 0) {
        return buildStaticErrorResult({
            agency: nameAgency,
            zone: zone.name,
            code: 'NO_RATE'
        });
    }

    return buildRateComplete({
        agency: nameAgency,
        zone: zone.name,
        services
    });
}