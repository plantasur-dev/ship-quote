
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

export function getEffectiveWeight(item, volumetricFactor) {

    const volumeM3 = calculateVolumeM3(item);

    const calculateVolumenWeight = 
        (!volumetricFactor?.enabled) 
            ? volumeM3 
            : volumeM3 * volumetricFactor.factor;

    return Math.max(item.weight, calculateVolumenWeight);
}

export function classifyPallet(item, palletTypes) {
    const effectiveWeight = getEffectiveWeight(item);

    for (const type of palletTypes) {
        const c = type.constraints;

        const fitsWeight = !c.maxWeight || effectiveWeight <= c.maxWeight;
        const fitsLength = !c.maxLength || item.large <= c.maxLength;
        const fitsWidth  = !c.maxWidth  || item.width  <= c.maxWidth;
        const fitsHeight = !c.maxHeight || item.height <= c.maxHeight;

        if (fitsWeight && fitsLength && fitsWidth && fitsHeight) {
            return type;
        }
    }

    return null;
}

export function groupPallets(items, palletTypes) {

    const groups = new Map();
    const rejected = [];

    for (const item of items) {

        const type = classifyPallet(item, palletTypes);

        if (!type) {
            rejected.push({
                type: 'No pallet type matched',
                ...item
            });
            continue;
        }

        const existing = groups.get(type._id);

        if (existing) {
            existing.quantity++;
            existing.items.push(item);
        } else {
            groups.set(type._id, {
                palletType: type,
                quantity: 1,
                items: [item]
            });
        }
    }

    return {
        groups: [...groups.values()],
        rejected
    };
}

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

export function matchPrice(breaks, packageWeight, fallbackToLastPrice = false) {

    if (!Array.isArray(breaks) || !breaks.length) {
        return undefined;
    }
    
    const match = breaks.find(weight => 
        packageWeight >= weight.min && 
        packageWeight <= weight.max
    );
    
    if (match && !match.price) {
        return undefined;
    }

    if (!match) {
        const breakPrices = breaks[breaks.length - 1];

        if (fallbackToLastPrice && packageWeight > breakPrices.max) {
            return breakPrices;
        }

        return undefined;
    }

    return match;
}

export function calculateFuelSurcharge(supplements, basePrice) {
    const fuel = supplements?.fuelSurcharge;

    if (!fuel?.enabled) return 0;

    const { type, value } = fuel;

    if (!value) return 0;

    let surchargeAmount = 0;

    if (type === 'percentage') {
        surchargeAmount = basePrice * (value / 100);
    } else if (type === 'fixed') {
        surchargeAmount = value;
    }

    return surchargeAmount;
}

export function calculateExcessWeight(extraKg, excessWeight) {

    if (!extraKg?.enabled) return 0;

    return excessWeight * extraKg.pricePerKg;
}

export function calculateAdditionalWeightBlockCost(multiParcelExcess, totalWeight) {

    if(!multiParcelExcess?.enabled) return 0;

    const { thresholdKg, divisor, pricePerBlock } = multiParcelExcess;

    if(totalWeight <= thresholdKg) return 0;
    
    const excessWeight = totalWeight - thresholdKg;
    const numBlocks = Math.ceil(excessWeight / divisor);

    return (numBlocks * pricePerBlock || 0);
}

export function matchDimensions(breaks, value) {
    return breaks.find(b => value >= b.min && value <= b.max);
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