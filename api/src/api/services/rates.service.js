
import Agency from "../../lib/models/agency.model.js";

import { 
    getStaticRates, 
    getApiRates 
} from "./rates/index.js";

import { 
    getScope, 
    AGENCY_TYPE 
} from "../../lib/constants/index.js";

async function rates(input) {

    const scope = getScope(input.countryCode);

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

    const [staticResults, apiResults] = await Promise.all([
        getStaticRates(staticAgencies, input),
        getApiRates(apiAgencies, input)
    ]);

    return [
        ...staticResults,
        ...apiResults
    ];
}

export default rates;