
import Zone from "../../lib/models/zone.model.js";
import ZoneRules from "../../lib/models/zone.rules.model.js";

import { zonesBootstrap } from "../../lib/utils/bootstrap.utils.js";

async function zonesFull({
    agency,
    zones,
    calculationMode,
    pricingMode,
    volumetric,
    exceptions
}) {

    const bootstrapParams = {
        zoneModel: Zone,
        zoneRuleModel: ZoneRules,
        agency,
        zones,
        rules: {
            calculationMode,
            pricingMode,
            volumetric,
            exceptions
        }
    };
    
    await zonesBootstrap(bootstrapParams);

    const insertedZones = await Zone
        .find({ agencyId: agency._id })
        .populate('agencyId', 'name code')
        .populate('rules');

    return insertedZones;
};

export default zonesFull;