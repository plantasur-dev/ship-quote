
import LABELS from '../../../../lib/constants/labels.messages.js';

function getConceptLabel(code) {
    return LABELS[code] ?? code;
}

export function presentRate(results) {
    return results.map(result => ({
        service: getConceptLabel(result.service),
        total: result.total,
        itemCount: result.itemCount,

        breakdown: result.concepts.map(concept => ({
            type: getConceptLabel(concept.code),
            price: concept?.amount,
            ...concept?.meta
        })),

        incidents: result.incidents.map(incident => ({
            type: getConceptLabel(incident.code),
            ...incident?.meta
        }))
    }));
}