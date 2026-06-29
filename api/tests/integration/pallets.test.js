
import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";

import PalletType from "../../src/lib/models/palletType.model.js";

describe("Pallets API", () => {

    it("debería crear un pallet", async () => {

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
            .send(payload)
            .expect(201);

        expect(res.body).toHaveProperty("name", "Pallet estándar");
        expect(res.body.constraints).toHaveProperty("maxWeight", 1000);
    });

    it("debería fallar si falta el nombre", async () => {

        const payload = {
            agencyId: new mongoose.Types.ObjectId(),
            constraints: {
                maxWeight: 1000
            }
        };

        const res = await request(app)
            .post("/api/v1/pallets")
            .send(payload)
            .expect(400);

        expect(res.body).toHaveProperty('name.name', 'ValidatorError');
    });

    it("debería fallar si faltan campos obligatorios", async () => {

        const payload = {
            name: "Pallet inválido"
        };

        const res = await request(app)
            .post("/api/v1/pallets")
            .send(payload)
            .expect(400);
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
            .expect(200);

        expect(res.body).toHaveLength(2);
    });

    it("debería devolver 404 si no hay pallets", async () => {

        const res = await request(app)
            .get("/api/v1/pallets")
            .expect(404);

        expect(res.body).toHaveProperty("message", "Pallets not found");
    });

    it("debería devolver detalle de un pallet", async () => {

        const pallet = await PalletType.create({
            agencyId: new mongoose.Types.ObjectId(),
            name: "Pallet detalle",
            constraints: { maxWeight: 500 }
        });

        const res = await request(app)
            .get(`/api/v1/pallets/${pallet._id}`)
            .expect(200);

        expect(res.body).toHaveProperty("name", "Pallet detalle");
    });

    it("debería devolver 404 si el pallet no existe", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/v1/pallets/${fakeId}`)
            .expect(404);

        expect(res.body).toHaveProperty("message", "Pallet not found");
    });

    it("debería fallar si el id no es válido", async () => {

        const res = await request(app)
            .get("/api/v1/pallets/invalid-id")
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
            .delete(`/api/v1/pallets/${pallet._id}`)
            .expect(204);

        const deleted = await PalletType.findById(pallet._id);
        expect(deleted).toBeNull();
    });

    it("debería devolver 204 aunque el pallet no exista", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        await request(app)
            .delete(`/api/v1/pallets/${fakeId}`)
            .expect(204);
    });
});