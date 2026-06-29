
import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";

import Agency from "../../src/lib/models/agency.model.js";

describe("POST /api/agencies", () => {

    it("debería crear una agencia", async () => {
        const payload = {
            name: "mr express",
            type: "api",
            active: true,
            rules: {
                hasAndaluciaRule: true,
                supportsPallets: true,
                supportsParcels: false,
                coverage: ["national"]
            },
            apiConfig: {
                baseUrlApi: "https://api.example.com",
                apiKey: "123456",
                endpoints: {
                    quotations: "/quotes",
                    transportOrders: "/orders"
                }
            }
        };

        const res = await request(app)
            .post("/api/v1/agencies")
            .send(payload)
            .expect(201);

        expect(res.body).toHaveProperty("name", "Mr Express");
        expect(res.body).toHaveProperty("code", "mr_express");
        expect(res.body).toHaveProperty("type", "api");
        expect(res.body.active).toBe(true);
    });

    it("debería fallar si falta el nombre", async () => {
        const payload = {
            type: "api",
            active: true,
        };

        const res = await request(app)
            .post("/api/v1/agencies")
            .send(payload)
            .expect(400);

        expect(res.body).toHaveProperty('message', 'Name is required');
    });

    it("debería fallar si el code es duplicado", async () => {
        await Agency.create({
            name: "mr express",
            code: "mr_express"
        });

        const res = await request(app)
            .post("/api/v1/agencies")
            .send({
                name: "mr express"
            })
            .expect(409);

        expect(res.body).toHaveProperty('message', 'Resource duplicate');
    });

    it("debería fallar si el type es inválido", async () => {
        const res = await request(app)
            .post("/api/v1/agencies")
            .send({
                name: "Invalid type",
                code: "invalid",
                type: "invalid_type"
            })
            .expect(400);

        expect(res.body).toHaveProperty('type.name', 'ValidatorError');
    });

    it("debería listar todas las agencias", async () => {
        await Agency.create([
            { name: "Agency One" },
            { name: "Agency Two" }
        ]);

        const res = await request(app)
            .get("/api/v1/agencies")
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(2);

        expect(res.body[0]).toHaveProperty("name");
        expect(res.body[1]).toHaveProperty("name");
    });

    it("debería devolver 404 si no hay agencias", async () => {
        const res = await request(app)
            .get("/api/v1/agencies")
            .expect(404);

        expect(res.body).toHaveProperty("message", "Agencies not found");
    });

    it("debería cambiar el estado activo de una agencia", async () => {
        const agency = await Agency.create({
            name: "Toggle Agency",
            active: true
        });

        const res = await request(app)
            .patch(`/api/v1/agencies/${agency._id}`)
            .expect(200);

        expect(res.body).toHaveProperty("active", false);
    });

    it("debería devolver 404 si la agencia no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .patch(`/api/v1/agencies/${fakeId}`)
            .expect(404);

        expect(res.body).toHaveProperty("message", "Agency not found");
    });
});