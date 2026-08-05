
import { calculateVolumeM3 } from '../../../../../lib/utils/rate.utils.js';

import { matchDimensions } from '../zone/zone.rules.js';

import { buildIncident } from '../build.rate.result.js';

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

    const envVolume = Number(process.env.DEFAULT_PARCEL_VOLUME);

    const PARCEL_VOL =
        Number.isFinite(envVolume) && envVolume > 0
            ? envVolume
            : 6000;

    return items.reduce((acc, item) => {
        acc.extraDimensionsCost += item.dimensionSupplement || 0;

        acc.totalItemsWeight += Number(item.weight || 0);

        acc.volumetric += calculateVolumeM3(item, PARCEL_VOL);

        return acc;
    }, {
        extraDimensionsCost: 0,
        totalItemsWeight: 0,
        volumetric: 0
    });
}