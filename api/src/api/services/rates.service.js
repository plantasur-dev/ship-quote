
import Agency from "../../lib/models/agency.model.js";

import { getScope } from "../../lib/constants/zone.scopes.js";

import { 
    getStaticRates, 
    getApiRates 
} from "./rates/index.js";

async function rates(input) {

    const scope = getScope(input.countryCode);

    const agencies = await Agency.find({ 
        active: { $ne: false }, 
        'rules.coverage': scope
    });

    const staticAgencies = 
        agencies.filter(agency => 
            agency.type === "static" || agency.type === "hybrid"
        );
        
    const apiAgencies = agencies.filter(agency => agency.type === "api");

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