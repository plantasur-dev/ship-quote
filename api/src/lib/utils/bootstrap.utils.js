
export const ex = (from, to, province, zoneName) => ({
  from,
  to,
  province,
  zoneName
});

function buildZoneRules(insertedZones, exceptions, provincesWithExceptions) {

    const rules = [];

    const zoneMap = new Map(
        insertedZones.map(zone => [zone.name, zone])
    );

    for (const zone of insertedZones) {
        for (const province of zone.provinces) {

            const hasExceptionRule =
                provincesWithExceptions.has(`${province}:${zone.name}`);

            if (hasExceptionRule) {
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

    for (const exception of exceptions) {

        const key = `${exception.province}:${exception.zoneName}`;

        if (!groupedExceptions.has(key)) {
            groupedExceptions.set(key, []);
        }

        groupedExceptions.get(key).push({
            from: exception.from,
            to: exception.to
        });
    }

    for (const [key, postalCodeRanges] of groupedExceptions.entries()) {

        const [province, zoneName] = key.split(':');

        const zone = zoneMap.get(zoneName);

        if (!zone) {
            throw new Error(`Zona no encontrada: ${zoneName}`);
        }

        rules.push({
            agencyId: zone.agencyId,
            zoneId: zone._id,
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
    insertedZones
}) {

    await zoneRuleModel.deleteMany({ agencyId: agency._id });

    const provincesWithExceptions = new Map();

    for (const ex of exceptions) {
        const key = `${ex.province}:${ex.zoneName}`;
        provincesWithExceptions.set(key, true);
    }

    const rules = buildZoneRules(
        insertedZones, 
        exceptions, 
        provincesWithExceptions
    );

    await zoneRuleModel.insertMany(rules);
}

export async function zonesBootstrap({ 
    zoneModel, 
    agency, 
    zones, 
    zoneRuleModel, 
    rules,
    zoneBuilder 
}) {
    const { calculationMode = '', pricingMode = {}, exceptions = [] } = rules;

    await zoneModel.deleteMany({ agencyId: agency._id });
    
    const docs = zones.map(zone => 
     zoneBuilder
        ? zoneBuilder(zone, agency) 
        : {
            agencyId: agency._id,
            name: zone.name,
            provinces: zone.provinces,
            calculationMode,
            pricingMode
        }
    );

    const insertedZones = await zoneModel.insertMany(docs);

    await zonesRulesBootstrap({ 
        zoneRuleModel,
        agency,
        exceptions,
        insertedZones
    });
}