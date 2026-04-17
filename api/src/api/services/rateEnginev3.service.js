
import Agency from "../../lib/models/agency.model.js";
import { getStaticRates } from "./compareRates/staticRates.service.js";
import { getApiRates } from "./compareRates/apiRates.service.js";

export async function compareRates(input) {

    const agencies = await Agency.find({ active: { $ne: false } });

    const staticAgencies = agencies.filter(a => a.type === "static");
    const apiAgencies = agencies.filter(a => a.type === "api");

    const [staticResults, apiResults] = await Promise.all([
        getStaticRates(staticAgencies, input),
        getApiRates(apiAgencies, input)
    ]);

    return [
        ...staticResults,
        ...apiResults
    ];
}