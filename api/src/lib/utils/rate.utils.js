
export const fixedToN = (num, n = 2) => Number(num.toFixed(n));

export function calculateVolume(item) {
    return (item.large * item.width * item.height);
}

export function calculateVolumeM3(item) {
    return calculateVolume(item) / 1_000_000;
}

export function resolveVolumetricFactor(zoneVolumetric, agencyVolumetric) {
    for (const volumetric of [zoneVolumetric, agencyVolumetric]) {
        if (
            volumetric?.enabled === true &&
            Number.isFinite(volumetric.factor) &&
            volumetric.factor > 0
        ) {
            return volumetric.factor;
        }
    }

    return null;
}

export function calculateVolumetricWeight(volumeM3, factor) {
    return factor == null ? null : volumeM3 * factor;
}

export function calculateChargeableWeight(realWeight, volumeM3, factor) {
    const volumetricWeight = calculateVolumetricWeight(volumeM3, factor);

    return volumetricWeight == null
        ? realWeight
        : Math.max(realWeight, volumetricWeight);
}

export function loadDataStaticRate(agency, tariffStore) {
    const agencyData =
        tariffStore[agency.id.toString()];
    
    const agencySupplements = agency?.supplements;
    const agencyZones = agencyData.zones || [];
    const agencyZonesRules = agencyData.zoneRules || [];

    const agencyRates = agencyData.ratesByKey || [];
    const agencyPalletTypes = agencyData.sortedPalletTypes || [];

    return { 
        agencyData, 
        agencySupplements, 
        agencyZones, 
        agencyZonesRules, 
        agencyRates, 
        agencyPalletTypes
    }
}