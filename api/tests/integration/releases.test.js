
import request from 'supertest';

import app from "../../app.js";

const latestRelease = {
    target: 'api',
    version: "3.3.0",
    title: "⛽ Nuevas tarifas y recargo por combustible",
    message: "✨ Ahora las tarifas incluyen el cálculo automático del Fuel Surcharge cuando aplica. También se han añadido las tarifas de Correos Express, MRW Portugal y una nueva zona para Baleares.",
    date: "2026-08-05"
};

describe("GET /api/v1/releases - latest()", () => {
    it("should return the latest release", async () => {
         await request(app)
            .get("/api/v1/releases/latest")
            .expect(200)
            .expect(latestRelease);
    });
});