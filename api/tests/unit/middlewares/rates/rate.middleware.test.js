
import Agency from "../../../../src/lib/models/agency.model";
import Zone from "../../../../src/lib/models/zone.model";
import PalletType from "../../../../src/lib/models/palletType.model";

import { rateValidation } from "../../../../src/api/middlewares/rate.validation.middleware";

let agency;
let zone;
let palletType;

 const zoneData = {
    name: "ZONA PRUEBAS",
    provinces: ["ES-M", "ES-TO"],
    calculationMode: "pallet",
    volumetric: { "enabled": true, "factor": 6000 },
    pricingMode: { "type": "weight_volume" },
    postalCodeRanges: []
};

const rateSend = {
    zoneName: 'ZONA PRUEBAS',
    type: 'pallet',
    services: [{
        service: 'premium',
        priceBreaks: [{ min: 1, max: 10, price: 10 }]
    }]
}

describe("rateValidation middleware", () => {

    beforeEach(async () => {
        agency = await Agency.create({
            "name": "Correos Prueba",
            "type": "static",
            "rules": {
                "hasAndaluciaRule": false,
                "supportsPallets": true,
                "supportsParcels": false
            }
        });

        zone = await Zone.create({
            "agencyId": agency._id,
            ...zoneData
        });

        palletType = await PalletType.create({
            "agencyId": agency._id,
            "name": "Pallet prueba",
            "constraints": {
                "maxWeight": "300",
                "maxHeight": "",
                "maxLength": "",
                "maxWidth": ""
            }
        });
    });

    afterEach(async () => {
        await Promise.all([
            Agency.deleteMany({}),
            Zone.deleteMany({}),
            PalletType.deleteMany({}),
        ]);
        vi.clearAllMocks();
    });

    const buildReq = (overrides = {}) => ({
        body: {
            agencyId: agency._id,
            palletTypeId: palletType._id,
            zoneId: zone._id,
            ...rateSend,
            ...overrides,
        },
    });

    it("should call next when calculationType is valid", async () => {
        const req = buildReq({ calculationType: "UNIT" });
        const res = {};
        const next = vi.fn();

        await rateValidation(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(req.body.calculationType).toBe("unit");
    });

    it("should return 400 when calculationType is empty", async () => {
        const req = buildReq({ calculationType: "      " });
        const res = {};
        const next = vi.fn();

        await expect(rateValidation(req, res, next)).rejects.toMatchObject({ 
            status: 400, 
            message: "calculationType cannot be empty"
        });

        expect(next).not.toHaveBeenCalledOnce();
    });

    it("should return 400 when calculationType is not allowed", async () => {
        const req = buildReq({ calculationType: "weight" });
        const res = {};
        const next = vi.fn();

        await expect(rateValidation(req, res, next)).rejects.toMatchObject({ 
            status: 400, 
            message: "calculationType must be one of: unit, quantity"
        });

        expect(next).not.toHaveBeenCalledOnce();
    });

    it("should call next when calculationType is not provided", async () => {
        const req = buildReq();
        delete req.body.calculationType;
        const res = {};
        const next = vi.fn();

        await rateValidation(req, res, next);

        expect(next).toHaveBeenCalledOnce();
    });
});