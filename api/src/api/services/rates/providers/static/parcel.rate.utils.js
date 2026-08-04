
import {
    matchPrice, 
    calculateExcessWeight, 
    calculateAdditionalWeightBlockCost, 
} from '../../domains/pricing/pricing.rules.js';

import {  
    buildConcept, 
} from '../../domains/build.rate.result.js';

export function resolveParcelPrice({ totalWeight, extraDimensionsCost, service }) {
    const { priceBreaks, surcharges } = service;

    const match = matchPrice(priceBreaks, totalWeight);

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
            )
        ]
    };
}