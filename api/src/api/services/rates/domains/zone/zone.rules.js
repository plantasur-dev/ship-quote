
function resolveZoneByZoneId(agencyData, zoneId) {
    return agencyData?.get(zoneId.toString()) ?? null;
}

function resolveFromRules(agencyData, postalCode, province) {
    return agencyData
                ?.get(province)
                ?.get(postalCode)
                ?.zoneId 
            ?? null;
}

function resolveZoneInProvince(agencyData, province, provinceWithPostalCode) {
    const zonesInProvince = 
        agencyData.zoneRulesByProvince?.get(provinceWithPostalCode) ??
        agencyData.zoneRulesByProvince.get(province);

    if (!zonesInProvince || !zonesInProvince.length) return null;

    const zoneDefault =
            zonesInProvince.find(z => z.isDefault)?.zoneId ??
            zonesInProvince[0].zoneId;

    return resolveZoneByZoneId(agencyData.zonesById, zoneDefault);
}

export function resolveZone(agencyData, postalCode, province) {
    const postalCodeTwoDigit = postalCode.slice(0, 2);
    const provinceWithPostalCode = `${province}-${postalCodeTwoDigit}`;

    let zoneId = resolveFromRules(
        agencyData.zoneExceptionsByPostalCode,
        postalCode,
        province
    );

    if(zoneId) return resolveZoneByZoneId(agencyData.zonesById, zoneId);
    
    zoneId = resolveFromRules(
        agencyData.zoneRangePostalByPostalCode,
        postalCodeTwoDigit,
        province
    );
    
    if(zoneId) return resolveZoneByZoneId(agencyData.zonesById, zoneId);

    return resolveZoneInProvince(agencyData, province, provinceWithPostalCode);
}

export function matchDimensions(breaks, value) {
    return breaks.find(b => value >= b.min && value <= b.max);
}