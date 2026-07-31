
import { describe, it, expect, vi } from "vitest";

import Agency from "../../../../src/lib/models/agency.model";
import PalletType from "../../../../src/lib/models/palletType.model";

import { rateValidation } from "../../../../src/api/middlewares/rate.validation.middleware";

let agency;
let palletType;

const dataSend = {
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

    it("should call next when calculationType is valid", async () => {
        const req = {
            body: {
                agencyId: agency._id,
                palletTypeId: palletType._id,
                ...dataSend,
                calculationType: "UNIT"
            }
        };

        const res = {};
        const next = vi.fn();

        await rateValidation(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.body.calculationType).toBe("unit");
    });


    it("should return 400 when calculationType is empty", async () => {
        const req = {
            body: {
                agencyId: agency._id,
                palletTypeId: palletType._id,
                ...dataSend,
                calculationType: "   "
            }
        };

        const res = {};
        const next = vi.fn();

        await expect(
            rateValidation(req, res, next)
        ).rejects.toThrow("calculationType cannot be empty");
    });


    it("should return 400 when calculationType is not allowed", async () => {
        const req = {
            body: {
                agencyId: agency._id,
                palletTypeId: palletType._id,
                ...dataSend,
                calculationType: "weight"
            }
        };

        const res = {};
        const next = vi.fn();

        await expect(
            rateValidation(req, res, next)
        ).rejects.toThrow(
            "calculationType must be one of: unit, quantity"
        );
    });


    it("should call next when calculationType is not provided", async () => {
        const req = {
            body: {
                agencyId: agency._id,
                palletTypeId: palletType._id,
                ...dataSend
            }
        };

        const res = {};
        const next = vi.fn();

        await rateValidation(req, res, next);

        expect(next).toHaveBeenCalled();
    });

});