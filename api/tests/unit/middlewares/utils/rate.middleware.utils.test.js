import {
    validateItem,
    validateService
} from '../../../../src/lib/utils/middleware/rate.middleware.utils.js';

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

describe('validateService price break pricing', () => {
    const service = pricing => ({
        service: 'basic',
        priceBreaks: [{
            min: 1001,
            max: 2000,
            price: 39.65,
            ...(pricing === undefined ? {} : { pricing })
        }]
    });

    it('accepts price per complete weight units', () => {
        expect(() => validateService(service({
            type: 'per_weight_unit',
            unitKg: 100,
            unit: '€/100kg'
        }), 0)).not.toThrow();
    });

    it('accepts a fixed override', () => {
        expect(() => validateService(service({ type: 'fixed' }), 0)).not.toThrow();
    });

    it.each([
        [{ type: 'unknown' }, '.type'],
        [{ type: 'per_weight_unit' }, '.unitKg'],
        [{ type: 'per_weight_unit', unitKg: 0 }, '.unitKg'],
        [{ type: 'fixed', unit: '  ' }, '.unit']
    ])('rejects invalid pricing config %j', (pricing, expectedPath) => {
        expect(() => validateService(service(pricing), 0))
            .toThrow(`services[0].priceBreaks[0].pricing${ expectedPath }`);
    });

    it('rejects a non-object pricing config', () => {
        expect(() => validateService(service('fixed'), 0))
            .toThrow('services[0].priceBreaks[0].pricing must be an object');
    });
});
