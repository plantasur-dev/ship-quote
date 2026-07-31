
import request from 'supertest';

import Rate from '../../src/lib/models/rate.model.js';
import rates from '../../src/api/services/rates.service.js';
import { getProvinceByCountryCodeAndPostalCode } from '../../src/api/services/provinces.service.js';
import Agency from '../../src/lib/models/agency.model.js';
import PalletType from '../../src/lib/models/palletType.model.js';
import Zone from '../../src/lib/models/zone.model.js';

vi.mock('../../src/api/services/rates.service.js', () => ({
    default: vi.fn()
}));

vi.mock('../../src/api/services/provinces.service.js', () => ({
    getProvinceByCountryCodeAndPostalCode: vi.fn()
}));

vi.mock('../../src/lib/models/rate.model.js', () => ({
    default: {
        create: vi.fn()
    }
}));

let app;

beforeAll(async () => {
    app = (await import('../../app.js')).default;
});

const validItem = {
    typeServices: 'pallet',
    weight: 10,
    large: 20,
    width: 15,
    height: 12
};

const validProvincePayload = {
    destinationPostalCode: '23400',
    countryCode: 'ES',
    province: 'ES-J',
    items: [validItem]
};

const validPostalCodePayload = {
    destinationPostalCode: '28001',
    countryCode: 'ES',
    items: [validItem]
};

const validInternationalPostalCodePayload = {
    destinationPostalCode: '84140',
    countryCode: 'FR',
    items: [validItem]
};

const zoneData = {
    name: "ZONA 1",
    provinces: ["ES-M", "ES-TO"],
    calculationMode: "pallet",
    volumetric: { "enabled": true, "factor": 6000 },
    pricingMode: { "type": "weight_volume" },
    postalCodeRanges: []
};

const compareResult = [{
    "agency": "Tecum",
    "available": true,
    "zone": "ZONA 21",
    "services": [
        {
            "service": "premium",
            "total": 38.55,
            "itemCount": 1,
            "breakdown": [
                {
                    "type": "Tarifa base",
                    "price": 38.55,
                    "palletType": "MINI QUARTER PALLET",
                    "quantity": 1,
                    "unitPrice": 38.55,
                    "items": [
                        {
                            "typeServices": "pallet",
                            "weight": 10,
                            "large": 20,
                            "width": 15,
                            "height": 12
                        }
                    ]
                }
            ],
            "incidents": []
        },
        {
            "service": "economy",
            "total": 36.55,
            "itemCount": 1,
            "breakdown": [
                {
                    "type": "Tarifa base",
                    "price": 36.55,
                    "palletType": "MINI QUARTER PALLET",
                    "quantity": 1,
                    "unitPrice": 36.55,
                    "items": [
                        {
                            "typeServices": "pallet",
                            "weight": 10,
                            "large": 20,
                            "width": 15,
                            "height": 12
                        }
                    ]
                }
            ],
            "incidents": []
        }
    ]
}];

let agency;
let zone;
let palletType;

describe('POST /api/v1/rates', () => {

    beforeEach(async () => {
        vi.clearAllMocks();

        agency = await Agency.create({
            "name": "Correos4",
            "type": "static",
            "rules": {
                "hasAndaluciaRule": false,
                "supportsPallets": true,
                "supportsParcels": false
            },
            "apiConfig": {
                "timeout": 3000,
                "baseUrlApi": "https://www.desa.cexpr.es/wspsc",
                "endpoints": {
                    "quotations": "",
                    "transportOrders": ""
                },
                "apiKey": "Pruebas"
            }
        });

        zone = await Zone.create({
            "agencyId": agency._id,
            ...zoneData
        });

        palletType = await PalletType.create({
            "agencyId": agency._id,
            "name": "Pallet prueba",
            "constraints": {
                "maxWeight": "300",
                "maxHeight": "",
                "maxLength": "",
                "maxWidth": ""
            }
        });
    });

    it('should return 400 when agencyId is missing', async () => {
        const res = await request(app)
            .post('/api/v1/rates')
            .send({
                type: 'pallet',
                zoneName: zone.name,
                services: [{
                    service: 'premium',
                    priceBreaks: [{ min: 1, max: 10, price: 10 }]
                }]
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('agencyId is required');
    });

    it('should return 400 when palleTypeId is null or empty', async () => {
        const res = await request(app)
            .post('/api/v1/rates')
            .send({
                agencyId: agency._id,
                type: 'pallet',
                zoneName: zone.name,
                services: [{
                    service: 'premium',
                    priceBreaks: [{ min: 1, max: 10, price: 10 }]
                }]
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('palletTypeId is required');
    });

    it('should return 400 when palletTypeId is invalid', async () => {
        const res = await request(app)
            .post('/api/v1/rates')
            .send({
                agencyId: agency._id,
                palletTypeId: 'invalid',
                type: 'pallet',
                zoneName: zone.name,
                services: [{
                    service: 'premium',
                    priceBreaks: [{ min: 1, max: 10, price: 10 }]
                }]
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('palletTypeId is not a valid id');
    });

    it('should return 400 when type is missing', async () => {
        const res = await request(app)
            .post('/api/v1/rates')
            .send({
                agencyId: agency._id,
                palletTypeId: palletType._id,
                zoneName: zone.name,
                services: [{
                    service: 'premium',
                    priceBreaks: [{ min: 1, max: 10, price: 10 }]
                }]
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('type is required');
    });
    
    it('should return 400 when type is invalid', async () => {
        const res = await request(app)
            .post('/api/v1/rates')
            .send({
                agencyId: agency._id,
                palletTypeId: palletType._id,
                type: 'invalid',
                zoneName: zone.name,
                services: [{
                    service: 'premium',
                    priceBreaks: [{ min: 1, max: 10, price: 10 }]
                }]
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('type must be one of');
    });

    it('should return 400 when zoneName is missing', async () => {
        const res = await request(app)
            .post('/api/v1/rates')
            .send({
                agencyId: agency._id,
                palletTypeId: palletType._id,
                type: 'pallet',
                services: [{
                    service: 'premium',
                    priceBreaks: [{ min: 1, max: 10, price: 10 }]
                }]
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('zoneName is required');
    });

    it('should return 400 when services is not Array o empty', async () => {
        const res = await request(app)
            .post('/api/v1/rates')
            .send({
                agencyId: agency._id,
                palletTypeId: palletType._id,
                type: 'pallet',
                calculationType: 'unit',
                zoneName: zone.name,
                services: []
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('services must be a non-empty array');
    });

    it('should return 201 when create rate', async () => {
        const res = await request(app)
            .post('/api/v1/rates')
            .send({
                agencyId: agency._id,
                palletTypeId: palletType._id,
                type: 'pallet',
                zoneName: zone.name,
                services: [{
                    service: 'premium',
                    priceBreaks: [{ min: 1, max: 10, price: 10 }]
                }]
            });

        expect(res.status).toBe(201);
    });
});

describe('POST /api/v1/rates/compareByProvinceCode', () => {

    it('should return 400 when body is empty', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toBe('The request does not comply with the schema');
    });

    it('should return 400 when destination fields are missing', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send({
                items: [validItem]
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toBe('destinationPostalCode and countryCode are required fields');
    });

    it('should return 400 when destination fields are not strings', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send({
                destinationPostalCode: 28001,
                countryCode: 34,
                items: [validItem]
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toBe('destinationPostalCode and countryCode must be strings');
    });

    it('should return 400 when postal code is invalid', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send({
                destinationPostalCode: 'invalid-Postal',
                countryCode: 'ES',
                items: [validItem]
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toBe('Postal Code invalid');
    });

    it('should return 400 when items is not an array', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send({
                destinationPostalCode: '28001',
                countryCode: 'ES',
                items: {}
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toBe('items must be an array');
    });

    it('should return 400 when items array is empty', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send({
                destinationPostalCode: '28001',
                countryCode: 'ES',
                items: []
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toBe('items cannot be empty');
    });

    it('should return 400 when typeServices is missing', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send({
                destinationPostalCode: '28001',
                countryCode: 'ES',
                items: [{
                    weight: 10,
                    large: 10,
                    width: 10,
                    height: 10
                }]
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toContain('typeServices is required');
    });

    it.each(['large', 'width', 'height', 'weight'])(
        'should return 400 when %s is invalid',
        async (field) => {
            const res = await request(app)
                .post('/api/v1/rates/compareByProvinceCode')
                .send({
                ...validProvincePayload,
                items: [{
                        ...validItem,
                        [field]: 0
                    }]
                });

            expect(res.status).toBe(400);
        }
    );

    it('should return 404 when compare is not found', async () => {
        rates.mockResolvedValue(null);

        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send(validProvincePayload);

        expect(res.status).toBe(404);
        expect(res.body.message)
        .toBe('Compare not found');
    });

    it('should return 200 and comparison result', async () => {
        rates.mockResolvedValue(compareResult);

        const res = await request(app)
            .post('/api/v1/rates/compareByProvinceCode')
            .send(validProvincePayload);

        expect(res.status).toBe(200);

        expect(res.body).toEqual(compareResult);

        expect(rates).toHaveBeenCalledWith({
            destinationPostalCode: '23400',
            countryCode: 'ES',
            province: 'ES-J',
            items: [validItem]
        });
    });
});

describe('POST /api/v1/rates/compareByPostalCode', () => {

    it('should return 400 when body is empty', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send({});

        expect(res.status).toBe(400);
    });

    it('should return 400 when destination fields are missing', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send({
                items: [validItem]
            });

        expect(res.status).toBe(400);
    });

    it('should return 404 when postal code is invalid', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send({
                destinationPostalCode: '99999',
                countryCode: 'ES',
                items: [validItem]
            });

        expect(res.status).toBe(404);
        expect(res.body.message)
        .toBe('Province not found');
    });

    it('should return 400 when countryCode is invalid', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send({
                destinationPostalCode: "28001",
                countryCode: "34",
                items: [validItem]
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toContain('countryCode invalid: received');
    });

    it('should return 400 when destinationPostalCode is empty', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send({
                destinationPostalCode: "",
                countryCode: "ES",
                items: [validItem]
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toBe('destinationPostalCode cannot be empty');
    });

    it('should return 400 when items array is empty', async () => {
        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send({
                destinationPostalCode: '28001',
                countryCode: 'ES',
                items: []
            });

        expect(res.status).toBe(400);
        expect(res.body.message)
        .toBe('items cannot be empty');
    });

    it('should return 404 when province is not found for default country', async () => {
        getProvinceByCountryCodeAndPostalCode.mockReturnValue(undefined);

        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send(validPostalCodePayload);

        expect(res.status).toBe(404);
        expect(res.body.message)
        .toBe('Province not found');

        expect(rates).not.toHaveBeenCalled();
    });

    it('should continue when province is not found but country is not default', async () => {
        getProvinceByCountryCodeAndPostalCode.mockReturnValue(undefined);

        rates.mockResolvedValue({
            agency: 'UPS'
        });

        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send({
                ...validInternationalPostalCodePayload
            });

        expect(res.status).toBe(200);

        expect(rates).toHaveBeenCalledWith({
            destinationPostalCode: '84140',
            countryCode: 'FR',
            province: '',
            items: [validItem]
        });
    });

    it('should return 404 when compare is not found', async () => {
        getProvinceByCountryCodeAndPostalCode.mockReturnValue({
            adminFullCode: 'ES-B'
        });

        rates.mockResolvedValue(null);

        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send(validPostalCodePayload);

        expect(res.status).toBe(404);
        expect(res.body.message)
        .toBe('Compare not found');
    });

    it('should return 200 and comparison result', async () => {
        getProvinceByCountryCodeAndPostalCode.mockReturnValue({
            adminFullCode: 'ES-M'
        });

        rates.mockResolvedValue(compareResult);

        const res = await request(app)
            .post('/api/v1/rates/compareByPostalCode')
            .send(validPostalCodePayload);

        expect(res.status).toBe(200);

        expect(res.body).toEqual(compareResult);

        expect(rates).toHaveBeenCalledWith({
            ...validPostalCodePayload,
            province: 'ES-M'
        });
    });
});