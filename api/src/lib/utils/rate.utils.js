
export function calculateVolume(item) {
    return (item.large * item.width * item.height);
}

export function calculateVolumeM3(item, volQuantity) {
    const PALLET_VOL = 
        volQuantity || 
        Number(process.env.DEFAULT_PALLET_VOLUME || 1_000_000);

    return fixedToN(
        (calculateVolume(item) / PALLET_VOL), 
        process.env.DEFAULT_VOLUME_DECIMALS
    );
}

export const fixedToN = (num, n = 2) => Number(num.toFixed(n));

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