
export function calculateVolume(item) {
    return (item.large * item.width * item.height);
}

export function calculateVolumeM3(item, volQuantity) {

    const PALLET_VOL = 
        volQuantity || 
        Number(process.env.DEFAULT_PALLET_VOLUME || 1_000_000);

    return calculateVolume(item) / PALLET_VOL;
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

        const existing = groups.get(type.id);

        if (existing) {
            existing.quantity++;
            existing.items.push(item);
        } else {
            groups.set(type.id, {
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

export function resolveZone_old(zones, postalCode, province) {
    for (const zone of zones) {
        const match = zone.postalCodeExceptions?.find(exception =>
            postalCode >= exception.from && postalCode <= exception.to
        );

        if (match) {
            return zones.find(z => z.name === match.zoneName);
        }
    }

    return zones.find(z => z.provinces.includes(province));
}

// Buscar tarifa
export function findRate(rates, { zoneName, palletTypeId, type }) {
    return rates.find(r =>
        r.type === type &&
        r.zoneName === zoneName &&
        (!palletTypeId || r.palletTypeId?.equals(palletTypeId))
    );
}

//-------------------------------------------------------------
export function resolveZone(agencyData, postalCode, province) {
    
    const zone = agencyData.zoneRulesByPostal
        ?.get(province)
        ?.get(postalCode);
    
    if (zone) {
        return agencyData.zonesById.get(
            zone.zoneId.toString()
        );
    }

    const zonesInProvince =
        agencyData.zoneRulesByProvince.get(province);
    
    if (!zonesInProvince || !zonesInProvince.length) return null;
    
    const zoneDefault = 
        zonesInProvince.find(z => z.isDefault) || zonesInProvince[0];
    
    return agencyData.zonesById.get(
        zoneDefault.zoneId.toString()
    );
}

export function findRate2(rates, { zoneName, palletTypeId, type }) {}


//-------------------------------------------------------------

// Buscar precio en tramos
export function matchPrice(breaks, value) {
    return breaks.find(b => value >= b.min && value <= b.max);
}

export function calculeRateByField(agencyRates, field = 'type') {
    const ratesMap = new Map();

    for (const r of agencyRates) {
        const field_select = r[field];
        const key = `${r.zoneName}_${field_select?.toString()}`;
        ratesMap.set(key, r);
    }

    return ratesMap;
};

export function groupByAgency(collection) {
    return collection.reduce((acc, item) => {
        const key = item.agencyId.toString();
        
        if (!acc[key]) acc[key] = [];
        
        acc[key].push(item);

        return acc;
    }, {});
};

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

export const round = (num) => Number(num.toFixed(2));