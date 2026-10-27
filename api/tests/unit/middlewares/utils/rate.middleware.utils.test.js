import { validateItem } from '../../../../src/lib/utils/middleware/rate.middleware.utils.js';

describe('validateItem', () => {
    it('normalizes valid numeric strings to numbers before rate calculation', () => {
        const item = {
            typeServices: 'parcel',
            weight: '12.5',
            large: '100',
            width: '50',
            height: '25'
        };

        validateItem(item, 0);

        expect(item).toEqual({
            typeServices: 'parcel',
            weight: 12.5,
            large: 100,
            width: 50,
            height: 25
        });
    });

    it('does not normalize an invalid item before reporting validation errors', () => {
        const item = {
            typeServices: 'parcel',
            weight: 'invalid',
            large: '100',
            width: '50',
            height: '25'
        };

        expect(() => validateItem(item, 0)).toThrow('Item 1: weight must be a number > 0');
        expect(item.weight).toBe('invalid');
        expect(item.large).toBe('100');
    });
});
