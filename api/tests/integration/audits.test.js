
import request from "supertest";
import app from "../../app.js";
import { createAuthenticatedUser } from "../helpers/auth.helpers.js";
import Audit from "../../src/lib/models/audit.model.js";

const auditsValid = {
    action: 'READ',
    endpoint: "/api/v1/auth/login",
    statusCode: 200
}

let authCookie;

beforeEach(async () => {
    ({ cookie: authCookie } = await createAuthenticatedUser());
});

describe('GET /api/v1/audits', () => {

    it('Debería devolver 404 si no hay audits', async () => {
        const res = await request(app)
            .get('/api/v1/audits')
            .set('Cookie', authCookie)
            .expect(404);

        expect(res.body).toHaveProperty("message", "Audits not founds");
    });

    it('Debería devolver 401 cuando no este autenticado', async () => {
        const res = await request(app)
            .get('/api/v1/audits')
            .expect(401);
    });

    it('Debería devolver 200 cuando existen audits', async () => {
        await Audit.create(auditsValid);

        const res = await request(app)
            .get('/api/v1/audits')
            .set('Cookie', authCookie)
            .expect(200);
    });

    it('Debería devolver 200 cuando existen audits y paginación', async () => {
        await Audit.create(auditsValid);

        const res = await request(app)
            .get('/api/v1/audits')
            .query({ page: 1, limit: 5 })
            .set('Cookie', authCookie)
            .expect(200);

        expect(res.body).toHaveProperty('pagination.limit', 5);
    });
    
});