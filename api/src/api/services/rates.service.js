
import Agency from "../../lib/models/agency.model.js";

import { 
    getStaticRates, 
    getApiRates 
} from "./rates/index.js";

import { 
    getScope,
    SCOPE_LABELS, 
    AGENCY_TYPE 
} from "../../lib/constants/index.js";

async function rates(input) {

    const scope = getScope(input.countryCode);

    const zone = SCOPE_LABELS[scope];

    const agencies = await Agency.find({ 
        active: { $ne: false }, 
        'rules.coverage': scope
    });

    const staticAgencies = 
        agencies.filter(agency => 
            agency.type === AGENCY_TYPE.STATIC || 
            agency.type === AGENCY_TYPE.HYBRID
        );
        
    const apiAgencies = 
        agencies.filter(agency => 
            agency.type === AGENCY_TYPE.API
        );

    const enrichedInput = { ...input, scope, zone };

    const [staticResults, apiResults] = await Promise.all([
        getStaticRates(staticAgencies, enrichedInput),
        getApiRates(apiAgencies, enrichedInput)
    ]);

    return [
        ...staticResults,
        ...apiResults
    ];
}

export default rates;