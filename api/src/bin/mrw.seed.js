
import Agency from "../lib/models/agency.model.js";

import Rate from "../lib/models/rate.model.js";
import Zone from "../lib/models/zone.model.js";

import { 
    mrwRates, 
    mrwZones
} from "../lib/storages/mrw.storage.js";

export async function seedMrwRate() {

    const agency = await Agency.findOne({ code: "mrw" });

    if (!agency) throw new Error("No existe Mrw");
    await Rate.deleteMany({ agencyId: agency.id, type: "parcel" });

    const inserts = [];

    for (const [zoneName, data] of Object.entries(mrwRates)) {

        inserts.push({
            agencyId: agency.id,
            type: "parcel",
            zoneName,
            palletTypeId: null,
            calculationType: "unit",
            services: [{
                service: "basic",
                priceBreaks: data.priceBreaks,
                surcharges: data.surcharges,
                limits: data.limits
            }]
        });
    }

    await Rate.insertMany(inserts);

    console.log("✅ Mrw rates insertados");
};

export async function seedMrwZone() {

    const agency = await Agency.findOne({ code: "mrw" });

    if (!agency) throw new Error("No existe Mrw");

    await Zone.deleteMany({ agencyId: agency.id });

    const inserts = [];

    for (const [name, data] of Object.entries(mrwZones)) {
        inserts.push({
            agencyId: agency.id,
            ...data
        });
    }

    await Zone.insertMany(inserts);

    console.log("✅ Mrw zones insertados");
};