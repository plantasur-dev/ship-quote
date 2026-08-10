
import request from "supertest";

import mongoose from "mongoose";

import app from "../../app.js";

import PalletType from "../../src/lib/models/palletType.model.js";

import Agency from "../../src/lib/models/agency.model.js";

import { createAuthenticatedUser } from "../utils/auth.js";
import { it } from "vitest";

describe("Pallets API", () => {

    let authCookie;

    beforeEach(async () => {
        ({ cookie: authCookie } = await createAuthenticatedUser());
    });

    it("debería crear un pallet", async () => {

        const agency = await Agency.create({ name: "Correos Prueba" });

        const payload = {
            agencyId: agency._id,
            name: "Pallet estándar",
            constraints: {
                maxWeight: 1000,
                maxHeight: 200,
                maxLength: 120,
                maxWidth: 80
            }
        };

        const res = await request(app)
            .post("/api/v1/pallets")
            .set("Cookie", authCookie)
            .send(payload)
            .expect(201);

        expect(res.body).toHaveProperty("name", "Pallet estándar");
        expect(res.body.constraints).toHaveProperty("maxWeight", 1000);
    });

    it("debería fallar si falta el nombre", async () => {

        const agency = await Agency.create({ name: "Test Agency" });

        const payload = {
            agencyId: agency._id,
            constraints: {
                maxWeight: 1000
            }
        };

        const res = await request(app)
            .post("/api/v1/pallets")
            .set("Cookie", authCookie)
            .send(payload)
            .expect(400);

        expect(res.body).toHaveProperty('name.name', 'ValidatorError');
    });

    it("debería fallar si faltan campos obligatorios", async () => {

        const agency = await Agency.create({ name: "Test Agency" });

        const payload = {
            agencyId: agency._id,
            name: "Pallet inválido"
        };

        const res = await request(app)
            .post("/api/v1/pallets")
            .set("Cookie", authCookie)
            .send(payload)
            .expect(400);
    });

    it("debería devolver 404 si la agencia no existe", async () => {
        const payload = {
            agencyId: new mongoose.Types.ObjectId(),
            name: "Pallet estándar",
            constraints: {
                maxWeight: 1000,
                maxHeight: 200,
                maxLength: 120,
                maxWidth: 80
            }
        };

        const res = await request(app)
            .post("/api/v1/pallets")
            .set("Cookie", authCookie)
            .send(payload)
            .expect(404);

        expect(res.body.message).toContain("not found");
    });

    it("debería listar pallets", async () => {

        await PalletType.create([
            {
                agencyId: new mongoose.Types.ObjectId(),
                name: "Pallet 1",
                constraints: { maxWeight: 100 }
            },
            {
                agencyId: new mongoose.Types.ObjectId(),
                name: "Pallet 2",
                constraints: { maxWeight: 200 }
            }
        ]);

        const res = await request(app)
            .get("/api/v1/pallets")
            .set("Cookie", authCookie)
            .expect(200);

        expect(res.body).toHaveLength(2);
    });

    it("debería devolver 404 si no hay pallets", async () => {

        const res = await request(app)
            .get("/api/v1/pallets")
            .set("Cookie", authCookie)
            .expect(404);

        expect(res.body).toHaveProperty("message", "Pallets not found");
    });

    it("debería devolver 200 si la agencia tiene pallets ", async () => {

        const agency = await Agency.create({ name: "Ag.WithPallets" });

        await PalletType.create([
            {
                agencyId: agency._id,
                name: "Pallet1 agencia 1 listado",
                constraints: { maxWeight: 100 }
            },
            {
                agencyId: agency._id,
                name: "Pallet2 agencia 1 listado",
                constraints: { maxWeight: 130 }
            },
            {
                agencyId: new mongoose.Types.ObjectId(),
                name: "Pallet de otra agencia listado",
                constraints: { maxWeight: 200 }
            }
        ]);
        
        const res = await request(app)
            .get(`/api/v1/agencies/${ agency._id }/pallets`)
            .set("Cookie", authCookie)
            .expect(200);
        
        expect(res.body[0]).toHaveProperty("name", "Pallet1 agencia 1 listado");
        expect(res.body[1]).toHaveProperty("name", "Pallet2 agencia 1 listado");
    });

    it("debería devolver 404 si la agencia no tiene pallets", async () => {

        const fakeAgencyId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/v1/agencies/${ fakeAgencyId }/pallets`)
            .set("Cookie", authCookie)
            .expect(404);

        expect(res.body.message).toContain("Pallets not found by agency");
    });

    it("debería devolver detalle de un pallet", async () => {

        const pallet = await PalletType.create({
            agencyId: new mongoose.Types.ObjectId(),
            name: "Pallet detalle",
            constraints: { maxWeight: 500 }
        });

        const res = await request(app)
            .get(`/api/v1/pallets/${ pallet._id }`)
            .set("Cookie", authCookie)
            .expect(200);

        expect(res.body).toHaveProperty("name", "Pallet detalle");
    });

    it("debería devolver 404 si el pallet no existe", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/v1/pallets/${ fakeId }`)
            .set("Cookie", authCookie)
            .expect(404);

        expect(res.body).toHaveProperty("message", "Pallet not found");
    });

    it("debería fallar si el id no es válido", async () => {

        const res = await request(app)
            .get("/api/v1/pallets/invalid-id")
            .set("Cookie", authCookie)
            .expect(404);

        expect(res.body).toHaveProperty('message', 'Resource not found');
    });

    it("debería eliminar un pallet", async () => {

        const pallet = await PalletType.create({
            agencyId: new mongoose.Types.ObjectId(),
            name: "Pallet delete",
            constraints: { maxWeight: 100 }
        });

        await request(app)
            .delete(`/api/v1/pallets/${ pallet._id }`)
            .set("Cookie", authCookie)
            .expect(204);

        const deleted = await PalletType.findById(pallet._id);
        expect(deleted).toBeNull();
    });

    it("debería devolver 204 aunque el pallet no exista", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        await request(app)
            .delete(`/api/v1/pallets/${fakeId}`)
            .set("Cookie", authCookie)
            .expect(204);
    });

    it("debería devolver 401 sin cookie de sesión", async () => {

        const res = await request(app)
            .get("/api/v1/pallets")
            .expect(401);

        expect(res.body).toHaveProperty("message", "Unauthorized");
    });
});