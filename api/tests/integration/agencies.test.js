
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import Agency from '../../src/lib/models/agency.model.js';
import PalletType from '../../src/lib/models/palletType.model.js';
import { createAuthenticatedUser } from '../helpers/auth.helpers.js';

let authCookie;

beforeEach(async () => {
    ({ cookie: authCookie } = await createAuthenticatedUser());
});

describe('POST /api/agencies', () => {

    it('devuelve 201 al crear una agencia', async () => {
        const payload = {
            name: 'mr express',
            type: 'api',
            active: true,
            rules: {
                hasAndaluciaRule: true,
                supportsPallets: true,
                supportsParcels: false,
                coverage: ['national']
            },
            apiConfig: {
                baseUrlApi: 'https://api.example.com',
                endpoints: {
                    quotations: '/quotes',
                    transportOrders: '/orders'
                },
                timeout: 3000
            }
        };

        const res = await request(app)
            .post('/api/v1/agencies')
            .set('Cookie', authCookie)
            .send(payload)
            .expect(201);

        expect(res.body).toHaveProperty('name', 'Mr Express');
        expect(res.body).toHaveProperty('code', 'mr_express');
        expect(res.body).toHaveProperty('type', 'api');
        expect(res.body.active).toBe(true);
    });
});

describe('PATCH /api/agencies/:agenciesId', () => {

    it('debería devolver 200 cuando actualiza una agencia dada por parámetro', async () => {

        const agency = await Agency.create({
            name: 'Toggle Agency',
            active: true,
            type: 'static',
            rules: {
                'hasAndaluciaRule': true,
                'supportsPallets': false,
                'supportsParcels': false,
                'coverage': [
                    'national'
                ]
            }
        });
        
        const payload = {
            active: false,
            type: 'static',
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: 'percentage',
                    value: 12
                }
            }
        };

        const res = await request(app)
            .patch(`/api/v1/agencies/${ agency._id }`)
            .set('Cookie', authCookie)
            .send(payload)
            .expect(200)

        expect(res.body).toHaveProperty('name', 'Toggle Agency');
        expect(res.body).toHaveProperty('rules.hasAndaluciaRule', true);
        expect(res.body).toHaveProperty('supplements', {
            fuelSurcharge: {
                enabled: true,
                type: 'percentage',
                value: 12,
            },
        });
    });

    it('200 should update supplements merging with existing supplements', async () => {

        const agency = await Agency.create({
            name: 'Toggle Agency',
            active: true,
            type: 'static',
            supplements: {
                fuelSurcharge: {
                    enabled: true,
                    type: 'percentage',
                    value: 12
                }
            }
        });
        
        const res = await request(app)
            .patch(`/api/v1/agencies/${ agency._id }`)
            .set('Cookie', authCookie)
            .send({
                active: true,
                type: 'static',
                supplements: {
                    fuelSurcharge: {
                            value: 38
                        }
                    }
                });

        expect(res.status).toBe(200);
        
        expect(res.body.supplements).toEqual({
            fuelSurcharge: {
                value: 38
            }
        });
    });

    it('200 should update apiConfig merging with existing apiConfig', async () => {

        const agency = await Agency.create({
            name: 'Toggle Agency',
            active: true,
            type: 'api',
            apiConfig: {
                baseUrlApi: 'https://api.example.com',
                apiKey: '123456',
                endpoints: {
                    quotations: '/quotes',
                    transportOrders: '/orders'
                }
            }
        });

        const res = await request(app)
            .patch(`/api/v1/agencies/${ agency._id }`)
            .set('Cookie', authCookie)
            .send({
                active: true,
                type: 'api',
                apiConfig: {
                    baseUrlApi: 'https://api.example.com',
                    endpoints: {
                        quotations: '/quotesPRUEBA',
                        transportOrders: '/orders'
                    },
                    timeout: 3000
                }
            });

        expect(res.body.apiConfig).toEqual({
                baseUrlApi: 'https://api.example.com',
                endpoints: {
                    quotations: '/quotesPRUEBA',
                    transportOrders: '/orders'
                },
                timeout: 3000
            }
        );
    });
});

describe('GET /api/agencies', () => {

    it('debería devolver 200 y listar todas las agencias', async () => {
        await Agency.create([
            { name: 'Agency One' },
            { name: 'Agency Two' }
        ]);

        const res = await request(app)
            .get('/api/v1/agencies')
            .set('Cookie', authCookie)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(2);

        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[1]).toHaveProperty('name');
    });

    it('debería devolver 404 si no hay agencias', async () => {
        const res = await request(app)
            .get('/api/v1/agencies')
            .set('Cookie', authCookie)
            .expect(404);

        expect(res.body).toHaveProperty('message', 'Agencies not found');
    });
});

describe('GET /api/agencies/{agenciesId}/pallets', () => {

    it('debería devolver 200 y listar los pallets asignados de una agencia', async () => {

        const agency = await Agency.create({
            name: 'Toggle Agency',
            active: true
        });

        const pallet = await PalletType.create( {
            'agencyId': agency._id,
            'name': 'Pallet prueba',
            'constraints': {
                'maxWeight': '200',
                'maxHeight': '90',
                'maxLength': '80',
                'maxWidth': '10'
            }
        });

        const res = await request(app)
            .get(`/api/v1/agencies/${ agency._id }/pallets`)
            .set('Cookie', authCookie)
            .expect(200);

        expect(res.body[0]).toHaveProperty('name', 'Pallet prueba');
    });

    it('debería devolver 404 si la agencia no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/v1/agencies/${ fakeId }/pallets`)
            .set('Cookie', authCookie)
            .expect(404);

        expect(res.body).toHaveProperty('message', `Pallets not found by agency ${ fakeId} `);
    });
});

describe('PATCH /api/agencies/{agenciesId}/active', () => {

    it('debería devolver 200 y cambiar el estado activo de una agencia', async () => {
        const agency = await Agency.create({
            name: 'Toggle Agency',
            active: true
        });

        const res = await request(app)
            .patch(`/api/v1/agencies/${ agency._id }/active`)
            .set('Cookie', authCookie)
            .expect(200);

        expect(res.body).toHaveProperty('active', false);
    });

    it('debería devolver 404 si la agencia no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .patch(`/api/v1/agencies/${ fakeId }/active`)
            .set('Cookie', authCookie)
            .expect(404);

        expect(res.body).toHaveProperty('message', 'Agency not found');
    });
});