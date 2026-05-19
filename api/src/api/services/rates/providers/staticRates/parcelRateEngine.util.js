
import {
    calculateVolumetricWeight,
    matchPrice,
    calculateFuelSurcharge,
    calculateAdditionalWeightBlockCost,
    calculateExcessWeight,
    matchDimensions
} from '../../../../utils/rateEngine.util.js';

import {  
    buildConcept, 
    buildIncident 
} from '../../domains/buildRateResult.js';

export function dimensionsItem(item) {
    const weight = Number(item.weight || 0);

    const large = Number(item.large || 0);
    const width = Number(item.width || 0);
    const height = Number(item.height || 0);

    const sumDimensions = large + width + height;

    return {
        weight,
        large,
        width,
        height,
        sumDimensions
    }
}

export function validateParcelItem(item, limits = {}) {
    const { weight, large, width, height, sumDimensions } = dimensionsItem(item);

    const maxWeight = limits.maxPieceWeight || limits.maxWeight;

    if (limits.maxLength && (
        large > limits.maxLength ||
        width > limits.maxLength ||
        height > limits.maxLength)
    ) {
        return buildIncident(
            'MAX_LENGTH_EXCEEDED',
            {
                maxLength: limits.maxLength,
                dimensions: {
                    large,
                    width,
                    height
                }
            }
        );
    }

    if (limits.maxSumDimensions && sumDimensions > limits.maxSumDimensions) {
        return buildIncident(
            'MAX_DIMENSIONS_EXCEEDED',
            {
                maxSumDimensions: limits.maxSumDimensions,
                currentDimensions: sumDimensions
            }
        );
    }

    if (maxWeight && weight > maxWeight) {
        return buildIncident(
            'MAX_WEIGHT_EXCEEDED',
            {
                maxWeight,
                currentWeight: weight
            }
        );
    }

    return null;
}

export function enrichParcelItem(item, surcharges = {}) {
    const { sumDimensions } = dimensionsItem(item);

    const extraDimensions =
        matchDimensions(
            surcharges.dimensionRanges || [],
            sumDimensions
        );

    return {
        ...item,
        dimensionSupplement: extraDimensions?.price || 0
    };
}

export function calculateParcelTotals(items) {
    return items.reduce((acc, item) => {
        acc.extraDimensionsCost += item.dimensionSupplement || 0;

        acc.totalItemsWeight += Number(item.weight || 0);

        acc.volumetric += calculateVolumetricWeight(item, 6000);

        return acc;
    }, {
        extraDimensionsCost: 0,
        totalItemsWeight: 0,
        volumetric: 0
    });
}

export function resolveParcelPrice({ totalWeight, extraDimensionsCost, service, agencySupplements}) {
    const { priceBreaks, surcharges } = service;

    const match = matchPrice(priceBreaks, totalWeight);

    if (match) {
        const fuelExtra =
            calculateFuelSurcharge(agencySupplements, match.price);

        return {
            concepts: [
                buildConcept(
                    'BASE',
                    match.price + fuelExtra
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

    const fuelExtra = 
        calculateFuelSurcharge(agencySupplements, last.price);

    const extraWeightCost =
        calculateExcessWeight(surcharges?.extraKg, excessWeight);

    const additionalBlockCost =
        calculateAdditionalWeightBlockCost(surcharges?.multiParcelExcess, totalWeight);

    return {
        concepts: [
            buildConcept('BASE', last.price + fuelExtra),
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