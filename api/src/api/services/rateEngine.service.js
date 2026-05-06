
import Agency from "../../lib/models/agency.model.js";

import { 
    getStaticRates, 
    getApiRates 
} from "./rateEngine/index.js";

async function rateEngine(input) {

    const agencies = await Agency.find({ active: { $ne: false } });

    const staticAgencies = agencies.filter(agency => 
        agency.type === "static" || 
        agency.type === "hybrid"
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

export default rateEngine;