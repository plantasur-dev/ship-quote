import {
    calculateParcelTotals,
    dimensionsItem
} from '../../../../../../src/api/services/rates/domains/parcel/parcel.rules.js';

describe('dimensionsItem', () => {
    it('uses the normalized numeric dimensions supplied by rate middleware', () => {
        expect(dimensionsItem({
            weight: 12.5,
            large: 100,
            width: 50,
            height: 25
        })).toEqual({
            weight: 12.5,
            large: 100,
            width: 50,
            height: 25,
            sumDimensions: 175
        });
    });
});

describe('calculateParcelTotals', () => {
    it('aggregates real weight, volume and dimension supplements', () => {
        expect(calculateParcelTotals([
            {
                weight: 12.5,
                large: 100,
                width: 50,
                height: 25,
                dimensionSupplement: 4
            },
            {
                weight: 7.5,
                large: 100,
                width: 100,
                height: 100,
                dimensionSupplement: 0
            }
        ])).toEqual({
            extraDimensionsCost: 4,
            totalItemsWeight: 20,
            totalVolumeM3: 1.125
        });
    });
});
