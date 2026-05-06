
import Agency from "../lib/models/agency.model.js";

import Rate from "../lib/models/rate.model.js";

import { correosRates } from "../lib/storages/cexp.storage.js";

export async function seedCorreosRates() {

    const agency = await Agency.findOne({ code: "correosexpress" });

    if (!agency) throw new Error("No existe Correos Express");

    await Rate.deleteMany({ agencyId: agency._id, type: "parcel" });

    const inserts = [];

    for (const [zoneName, data] of Object.entries(correosRates)) {

        inserts.push({
            agencyId: agency.id,
            type: "parcel",
            zoneName,
            palletTypeId: null,
            calculationType: "unit",
            services: [{
                service: "basic",
                priceBreaks: data.priceBreaks,
                extraKg: data.extraKg,
                constraints: data.constraints
            }]
        });
    }

    await Rate.insertMany(inserts);

    console.log("✅ Correos Express rates insertados");
}