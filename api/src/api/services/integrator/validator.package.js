
export function validateAgencyPackage(agencyPackage) {

    const { agency, zones, exceptions, palletTypes, rates } = agencyPackage;

    if (!agency?.code || !agency.name) {
        throw new Error('Agency package must define agency code and name');
    }

    for (const [name, value] of Object.entries({
        zones,
        exceptions,
        palletTypes,
        rates
    })) {
        if (!Array.isArray(value)) {
            throw new Error(`${ agency.code } package must define ${ name } as an array`);
        }
    }

    const zonesByName = new Map();

    for (const zone of zones) {
        if (!zone.name || zonesByName.has(zone.name)) {
            throw new Error(`Invalid or duplicate zone "${ zone.name }" for ${ agency.code }`);
        }

        zonesByName.set(zone.name, zone);
    }

    for (const exception of exceptions) {
        const zone = zonesByName.get(exception.zoneName);

        if (!zone) {
            throw new Error(
                `Exception references unknown zone "${ exception.zoneName }" for ${ agency.code }`
            );
        }

        if (!zone.provinces?.includes(exception.province)) {
            throw new Error(
                `Exception province "${ exception.province }" is not in zone ` +
                `"${ exception.zoneName }" for ${ agency.code }`
            );
        }
    }

    const palletNames = new Set(palletTypes.map(({ name }) => name));

    for (const rate of rates) {
        if (!zonesByName.has(rate.zoneName)) {
            throw new Error(
                `Rate references unknown zone "${ rate.zoneName }" for ${ agency.code }`
            );
        }

        if (rate.palletType != null && !palletNames.has(rate.palletType)) {
            throw new Error(
                `Rate references unknown pallet type "${ rate.palletType }" for ${ agency.code }`
            );
        }
    }

    return agencyPackage;
}