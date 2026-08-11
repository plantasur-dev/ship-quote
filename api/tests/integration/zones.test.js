
import request from "supertest";

import mongoose from "mongoose";

import app from "../../app.js";

import Zone from "../../src/lib/models/zone.model.js";
import Agency from "../../src/lib/models/agency.model.js";

import { createAuthenticatedUser } from "../helpers/auth.helpers.js";

let authCookie;

beforeEach(async () => {
    ({ cookie: authCookie } = await createAuthenticatedUser());
});

describe("Zones API", () => {

    it("debería crear una zona", async () => {

        const agency = await Agency.create({
            name: "Test Agency"
        });

        const payload = {
            agencyId: agency._id,
            name: "Zona Norte",
            provinces: ["ES-M", "ES-TO"],
            calculationMode: "pallet",
            volumetric: { "enabled": true, "factor": 6000 },
            pricingMode: { "type": "weight_volume" },
            postalCodeRanges: []
        };

        const res = await request(app)
            .post("/api/v1/zones")
            .set('Cookie', authCookie)
            .send(payload)
            .expect(201);

        expect(res.body).toHaveProperty("name", "Zona Norte");
        expect(res.body).toHaveProperty("agencyId");
    });

    it("debería fallar si falta agencyId", async () => {

        const res = await request(app)
            .post("/api/v1/zones")
            .set('Cookie', authCookie)
            .send({
                name: "Zona inválida"
            })
            .expect(400);

        expect(res.body).toHaveProperty("message", "agencyId is required");
    });

    it("debería fallar si el agencyId no existe", async () => {

        const res = await request(app)
            .post("/api/v1/zones")
            .set("Cookie", authCookie)
            .send({
                agencyId: new mongoose.Types.ObjectId(),
                name: "Zona huérfana",
                provinces: ["ES-M"]
            })
            .expect(404);

        expect(res.body.message).toContain("not found");
    });

    it("debería fallar si falta name de la Zona", async () => {

        const agency = await Agency.create({
            name: "Test Agency"
        });

        const res = await request(app)
            .post("/api/v1/zones")
            .set('Cookie', authCookie)
            .send({
                agencyId: agency._id
            })
            .expect(400);

        expect(res.body).toHaveProperty("message", "name is required");
    });

    it("debería listar zonas con populate", async () => {

        const agency = await Agency.create({
            name: "Agency Popu"
        });

        await Zone.create([
            {
                agencyId: agency._id,
                name: "Zona 1",
                provinces: ["Madrid"]
            },
            {
                agencyId: agency._id,
                name: "Zona 2",
                provinces: ["Barcelona"]
            }
        ]);

        const res = await request(app)
            .get("/api/v1/zones")
            .set('Cookie', authCookie)
            .expect(200);

        expect(res.body.zones).toHaveLength(2);

        expect(res.body.zones[0]).toHaveProperty("agencyId");
        expect(res.body.zones[0].agencyId).toHaveProperty("name");
        expect(res.body.zones[0].agencyId).toHaveProperty("code");
    });

    it("debería fallar si una provincia no existe en el catálogo", async () => {

        const agency = await Agency.create({
            name: "Test Agency"
        });

        const res = await request(app)
            .post("/api/v1/zones")
            .set("Cookie", authCookie)
            .send({
                agencyId: agency._id,
                name: "Zona con provincia inválida",
                provinces: ["Madrid"]
            })
            .expect(400);

        expect(res.body.message).toContain("Unknown provinces");
    });

    it("debería devolver 404 si no hay zonas", async () => {

        const res = await request(app)
            .get("/api/v1/zones")
            .set('Cookie', authCookie)
            .expect(404);

        expect(res.body).toHaveProperty("message", "Zones not found");
    });

    it("debería devolver detalle de zona", async () => {

        const agency = await Agency.create({
            name: "Agency Detail"
        });

        const zone = await Zone.create({
            agencyId: agency._id,
            name: "Zona detalle",
            provinces: ["Sevilla"]
        });

        const res = await request(app)
            .get(`/api/v1/zones/${zone._id}`)
            .set('Cookie', authCookie)
            .expect(200);

        expect(res.body).toHaveProperty("name", "Zona detalle");

        expect(res.body.agencyId).toHaveProperty("name");
    });

    it("debería devolver 404 si la zona no existe", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/v1/zones/${fakeId}`)
            .set('Cookie', authCookie)
            .expect(404);

        expect(res.body).toHaveProperty("message", "Zone not found");
    });

    it("debería fallar si el id es inválido", async () => {

        const res = await request(app)
            .get("/api/v1/zones/invalid-id")
            .set('Cookie', authCookie)
            .expect(404);

        expect(res.body).toHaveProperty('message', 'Resource not found');
    });

    it('Post /zones/full debería insertar las zones. zoneRules responder con 201', async () => {
        const agency = await Agency.create({
            name: "Test Agency"
        });

        const res = await request(app)
            .post('/api/v1/zones/full')
            .set('Cookie', authCookie)
            .send({
                agencyId: agency._id,
                calculationMode: "pallet",
                pricingMode: {
                    type: "pallet_classification"
                },
                volumetric: {
                    enabled: false
                },
                zones: [
                    {
                        name: "ZONA 14",
                        provinces: ["ES-GU", "ES-M"]
                    },
                    {
                        name: "ZONA 23",
                        provinces: ["ES-SO", "ES-TO"]
                    }
                ],
                exceptions: [
                    {
                        province: "ES-GU",
                        zoneName: "ZONA 23",
                        from: "19261",
                        to: "19261",
                        kind: "exception"
                    },
                    {
                        province: "ES-GU",
                        zoneName: "ZONA 23",
                        from: "19280",
                        to: "19287",
                        kind: "exception"
                    }
                ]
            });

        expect(res.status).toBe(201);
    });

    it("debería devolver 401 sin cookie de sesión", async () => {

        const res = await request(app)
            .get("/api/v1/zones")
            .expect(401);

        expect(res.body).toHaveProperty("message", "Unauthorized");
    });
});