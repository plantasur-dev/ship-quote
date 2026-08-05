
import {
    matchPrice, 
    calculateExcessWeight, 
    calculateAdditionalWeightBlockCost,
    calculateFixedSurcharge, 
} from '../../domains/pricing/pricing.rules.js';

import {  
    buildConcept, 
} from '../../domains/build.rate.result.js';

export function resolveParcelPrice({ totalWeight, extraDimensionsCost, itemCount, service }) {
    const { priceBreaks, surcharges } = service;

    const match = matchPrice(priceBreaks, totalWeight);

    const fixedSurchargeAmount = 
        calculateFixedSurcharge(surcharges?.fixedSurcharge, itemCount);

    if (match) {
        return {
            concepts: [
                buildConcept(
                    'BASE',
                    match.price
                ),
                ...(extraDimensionsCost > 0
                    ? [
                        buildConcept(
                            'EXTRA_DIMENSIONS',
                            extraDimensionsCost
                        )
                    ]
                    : []
                ),
                ...(fixedSurchargeAmount > 0
                    ? [
                        buildConcept(
                            'FIXED_SURCHARGE',
                            fixedSurchargeAmount
                        )
                    ]
                    : []
                )
            ]
        };
    }

    const last = priceBreaks?.[priceBreaks.length - 1];
    if (!last) return null;

    const excessWeight = totalWeight - last.max;
    if (excessWeight <= 0) return null;

    const extraWeightCost =
        calculateExcessWeight(surcharges?.extraKg, excessWeight);

    const additionalBlockCost =
        calculateAdditionalWeightBlockCost(surcharges?.multiParcelExcess, totalWeight);

    return {
        concepts: [
            buildConcept('BASE', last.price),
            ...(extraDimensionsCost > 0
                ? [
                    buildConcept(
                        'EXTRA_DIMENSIONS',
                        extraDimensionsCost
                    )
                ]
                : []
            ),
            ...(additionalBlockCost > 0
                ? [
                    buildConcept(
                        'ADDITIONAL_BLOCK',
                        additionalBlockCost
                    )
                ]
                : []
            ),
            ...(extraWeightCost > 0
                ? [
                    buildConcept(
                        'EXTRA_WEIGHT',
                        extraWeightCost,
                        {
                            excessWeight
                        }
                    )
                ]
                : []
            ),
            ...(fixedSurchargeAmount > 0
                ? [
                    buildConcept(
                        'FIXED_SURCHARGE',
                        fixedSurchargeAmount
                    )
                ]
                : []
            )
        ]
    };
}