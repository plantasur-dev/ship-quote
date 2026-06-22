
import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";

import Zone from "../../src/lib/models/zone.model.js";
import Agency from "../../src/lib/models/agency.model.js";

describe("Zones API", () => {

    it("debería crear una zona", async () => {

        const agency = await Agency.create({
            name: "Test Agency"
        });

        const payload = {
            agencyId: agency._id,
            name: "Zona Norte",
            provinces: ["Madrid", "Toledo"],
            calculationMode: "pallet"
        };

        const res = await request(app)
            .post("/api/v1/zones")
            .send(payload)
            .expect(201);

        expect(res.body).toHaveProperty("name", "Zona Norte");
        expect(res.body).toHaveProperty("agencyId");
    });

    it("debería fallar si falta agencyId", async () => {

        const res = await request(app)
            .post("/api/v1/zones")
            .send({
                name: "Zona inválida"
            })
            .expect(400);

        expect(res.body).toHaveProperty('agencyId.name', 'ValidatorError');
    });

    it("debería fallar si falta name", async () => {

        const agency = await Agency.create({
            name: "Test Agency"
        });

        const res = await request(app)
            .post("/api/v1/zones")
            .send({
                agencyId: agency._id
            })
            .expect(400);

        expect(res.body).toHaveProperty('name.name', 'ValidatorError');
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
            .expect(200);

        expect(res.body).toHaveLength(2);

        expect(res.body[0]).toHaveProperty("agencyId");
        expect(res.body[0].agencyId).toHaveProperty("name");
        expect(res.body[0].agencyId).toHaveProperty("code");
    });

    it("debería devolver 404 si no hay zonas", async () => {

        const res = await request(app)
            .get("/api/v1/zones")
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
            .expect(200);

        expect(res.body).toHaveProperty("name", "Zona detalle");

        expect(res.body.agencyId).toHaveProperty("name");
    });

    it("debería devolver 404 si la zona no existe", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/v1/zones/${fakeId}`)
            .expect(404);

        expect(res.body).toHaveProperty("message", "Zone not found");
    });

    it("debería fallar si el id es inválido", async () => {

        const res = await request(app)
            .get("/api/v1/zones/invalid-id")
            .expect(404);

        expect(res.body).toHaveProperty('message', 'Resource not found');
    });
});