export const fixed = (price) => [{ min: 1, max: 1, price }];

export function ex(from, to, province, zoneName) {
  return { from, to, province, zoneName, kind: 'exception' };
};

export function prefixZone(representativeCp, province, zoneName) {
    return { from: representativeCp, to: representativeCp, province, zoneName, kind: 'prefix' };
}

function buildZoneRules(insertedZones, exceptions, agencyId) {

    const rules = [];

    const zoneMap = new Map(
        insertedZones.map(zone => [zone.name, zone])
    );

    const normalizedExceptions = exceptions.map(exception => {

        const zone = zoneMap.get(exception.zoneName);

        if (!zone) {
            throw new Error(`Zona no encontrada: ${exception.zoneName}`);
        }

        return {
            province: exception.province,
            zoneId: zone._id,
            from: exception.from,
            to: exception.to,
            kind: exception.kind
        };
    });

    const pairsWithOwnRanges = new Set(
        normalizedExceptions.map(exception => `${exception.province}::${exception.zoneId}`)
    );

    for (const zone of insertedZones) {
        for (const province of zone.provinces) {

            const key = `${province}::${zone._id}`;

            if (pairsWithOwnRanges.has(key)) {
                continue;
            }

            rules.push({
                agencyId: zone.agencyId,
                zoneId: zone._id,
                province,
                isDefault: true,
                postalCodeRanges: []
            });
        }
    }

    const groupedExceptions = new Map();

    for (const exception of normalizedExceptions) {

        const key = `${exception.province}::${exception.zoneId}`;

        if (!groupedExceptions.has(key)) {
            groupedExceptions.set(key, []);
        }

        groupedExceptions.get(key).push({
            from: exception.from,
            to: exception.to,
            kind: exception.kind
        });
    }

    for (const [key, postalCodeRanges] of groupedExceptions.entries()) {

        const [province, zoneId] = key.split('::');

        rules.push({
            agencyId,
            zoneId,
            province,
            isDefault: false,
            postalCodeRanges
        });
    }

    return rules;
}

async function zonesRulesBootstrap({
    zoneRuleModel,
    agency,
    exceptions,
    insertedZones,
    session
}) {

    await zoneRuleModel.deleteMany({ agencyId: agency._id }, { session });

    const rules = buildZoneRules(insertedZones, exceptions, agency._id);

    await zoneRuleModel.insertMany(rules, { session });
}

export async function zonesBootstrap({ 
    zoneModel, 
    agency, 
    zones, 
    zoneRuleModel, 
    rules,
    zoneBuilder,
    session
}) {
    const { calculationMode = '', pricingMode = {}, exceptions = [], volumetric = {} } = rules;

    await zoneModel.deleteMany({ agencyId: agency._id }, { session });
    
    const docs = zones.map(zone => 
     zoneBuilder
        ? zoneBuilder(zone, agency) 
        : {
            agencyId: agency._id,
            name: zone.name,
            provinces: zone.provinces,
            calculationMode,
            pricingMode,
            volumetric
        }
    );

    const insertedZones = await zoneModel.insertMany(docs, { session });

    await zonesRulesBootstrap({ 
        zoneRuleModel,
        agency,
        exceptions,
        insertedZones,
        session
    });
}