
import Agency from "../../lib/models/agency.model.js";

import { getStaticRates, getApiRates } from "./compareRates/index.js";

export async function compareRates(input) {

    const agencies = await Agency.find({ active: { $ne: false } });

    const staticAgencies = agencies.filter(agency => agency.type === "static");
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