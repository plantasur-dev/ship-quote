
import request from 'supertest';
import app from '../../app.js';

describe('API /agencies', () => {
    it('debería crear una agencia', async () => {
        const response = await request(app)
        .post('/api/v1/agencies')
        .send({
            name: 'Dachser',
            code: 'dachser',
            type: 'api',
            rules: { supportsPallets: true }
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Dachser');
    });
});