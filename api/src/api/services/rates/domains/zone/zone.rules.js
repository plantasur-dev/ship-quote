
export function resolveZone(agencyData, postalCode, province) {
    let zoneId = agencyData.zoneExceptionsByPostalCode
        ?.get(province)
        ?.get(postalCode)
        ?.zoneId;

    if (zoneId) {
        return agencyData.zonesById.get(zoneId.toString());
    }

    zoneId = agencyData.zoneRangePostalByPostalCode
        ?.get(province)
        ?.get(postalCode.slice(0, 2))
        ?.zoneId;

    if (zoneId) {
        return agencyData.zonesById.get(zoneId.toString());
    }

    const zonesInProvince =
        agencyData.zoneRulesByProvince.get(province);

    if (!zonesInProvince || !zonesInProvince.length) return null;

    const zoneDefault =
            zonesInProvince.find(z => z.isDefault)?.zoneId ??
            zonesInProvince[0].zoneId;

    return agencyData.zonesById.get(zoneDefault.toString()) ?? null;
}

export function matchDimensions(breaks, value) {
    return breaks.find(b => value >= b.min && value <= b.max);
}