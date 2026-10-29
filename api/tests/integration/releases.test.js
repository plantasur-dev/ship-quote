
import request from 'supertest';
import app from "../../app.js";

const latestRelease = {
    target: 'api',
    version: "4.4.1",
    title: "📦 Nuevas agencias y tarifas internacionales",
    message: "✨ Se incorpora CTT para envíos de paquetería nacional en España y Kuehne Nagel para transporte de palés en Austria, Bélgica, República Checa, Francia, Alemania, Países Bajos y Eslovenia.",
    date: "2026-10-29"
};

describe("GET /api/v1/releases - latest()", () => {
    it("should return the latest release", async () => {
        await request(app)
        .get("/api/v1/releases/latest")
        .expect(200)
        .expect(latestRelease);
    });
});