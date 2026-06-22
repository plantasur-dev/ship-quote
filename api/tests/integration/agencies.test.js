
import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";

import Agency from "../../src/lib/models/agency.model.js";

describe("POST /api/agencies", () => {

    beforeEach(async () => {
        await Agency.deleteMany({});
    });

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
            name: "Test Agencia",
            code: "test_agencia"
        });

        const res = await request(app)
            .post("/api/v1/agencies")
            .send({
                name: "Test Agencia"
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
});