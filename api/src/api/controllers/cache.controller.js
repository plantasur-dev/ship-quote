
import { getAgencyTariffs } from "../services/cache.service.js";

function inspectAgencyTariffs(agencies) {
    const result = {};

    for (const [agencyId, agency] of Object.entries(agencies)) {
        result[agencyId] = {};

        for (const [key, value] of Object.entries(agency)) {
            if (value instanceof Map) {
                result[agencyId][key] = {
                    type: "Map",
                    size: value.size
                };

                // Para Maps que contienen otros Maps
                const nestedMaps = [...value.entries()]
                    .filter(([, v]) => v instanceof Map)
                    .map(([k, v]) => ({
                        key: k,
                        size: v.size
                    }));

                if (nestedMaps.length) {
                    result[agencyId][key].nestedMaps = nestedMaps;
                }

            } else if (Array.isArray(value)) {
                result[agencyId][key] = {
                    type: "Array",
                    size: value.length
                };
            } else {
                result[agencyId][key] = {
                    type: typeof value
                };
            }
        }
    }

    return result;
}

export const debugMap = (req, res) => {
    if (process.env.NODE_ENV !== 'test') {
        return res.status(204).end();
    }
        
    res.json(inspectAgencyTariffs(getAgencyTariffs()));
};