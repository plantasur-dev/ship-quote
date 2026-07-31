
import request from 'supertest';

import app from "../../app.js";

const latestRelease = {
    target: 'api',
    version: "3.2.0",
    title: "🚚 Nueva agencia disponible: Rhenus Internacional",
    message: "✨ Se ha añadido la agencia Rhenus Internacional con tarifas para Alemania, Austria, Bélgica, Francia, República Checa e Italia.",
    date: "2026-07-28"
};

describe("GET /api/v1/releases - latest()", () => {
    it("should return the latest release", async () => {
         await request(app)
            .get("/api/v1/releases/latest")
            .expect(200)
            .expect(latestRelease);
    });
});