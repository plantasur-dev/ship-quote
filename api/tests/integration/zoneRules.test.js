
import request from 'supertest';

import app from "../../app.js";

import mongoose from "mongoose";

import Agency from '../../src/lib/models/agency.model.js';
import Zone from '../../src/lib/models/zone.model.js';
import ZoneRules from '../../src/lib/models/zone.rules.model.js';

let agency;
let zone;

const agencyData = {
    name: "CorreosPrueba",
    type: "static",
    rules: {
        hasAndaluciaRule: false,
        supportsPallets: true,
        supportsParcels: true
    }
};

const zoneData = {
    name: "PROVINCIAL Prueba",
    provinces: ["ES-J"],
    calculationMode: "pallet",
    volumetric: { "enabled": true, "factor": 6000 },
    pricingMode: { "type": "weight_volume" },
    postalCodeRanges: []
};

const zoneRuleData = {
    province: "ES-J",
    postalCodeRanges: []
};

describe("POST /zones/:zoneId/rules", () => {

    beforeEach(async () => {
        agency = await Agency.create(agencyData);

        zone = await Zone.create({
            agencyId: agency._id,
            ...zoneData
        });
    });

    it('should return 404 when zoneId is not found', async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .post(`/api/v1/zones/${fakeId}/rules`)
            .send({
                zoneId: fakeId,
                agencyId: agency._id,
                ...zoneRuleData
            })
            .expect(404);
        
        expect(res.body.message).toBe('Zone not found');
    });

    it('should return 201 when creating zone rules for a zone ID', async () => {

        const res = await request(app)
            .post(`/api/v1/zones/${zone._id}/rules`)
            .send({
                zoneId: zone._id,
                agencyId: agency._id,
                ...zoneRuleData
            });
        
        expect(res.status).toBe(201);
    });

});

describe("GET /zones/:zoneId/rules", () => {

    it('should return 404 when zoneId is not found', async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/v1/zones/${fakeId}/rules`)
            .expect(404);
        
        expect(res.body.message).toBe('Zone Rules not founds');
    });

    it('should return 200 when zoneId is ok', async () => {

        const agency = await Agency.create({
            name: "Agency Detail"
        });

        const zone = await Zone.create({
            agencyId: agency._id,
            name: "Zona para ZoneRule",
            provinces: ["ES-S"]
        });

        const zoneRule = await ZoneRules.create({
            zoneId: zone._id,
            agencyId: agency._id,
            province: "ES-S",
            postalCodeRanges: []
        });

        const res = await request(app)
            .get(`/api/v1/zones/${zone._id}/rules`)
            .expect(200);
        
        expect(res.body[0]).toHaveProperty("agencyId", agency._id.toString());
        expect(res.body[0]).toHaveProperty("province", "ES-S");
        expect(res.body[0]).toHaveProperty("isDefault", true);
    });
});