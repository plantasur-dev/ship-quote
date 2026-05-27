
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

    const sortedPallets = [...palletTypes].sort((a, b) => {
        return (
            a.constraints.maxWeight - b.constraints.maxWeight ||
            a.constraints.maxHeight - b.constraints.maxHeight
        );
    });

    for (const type of sortedPallets) {
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

    const result = items.reduce((acc, item) => {
        const type = classifyPallet(item, palletTypes);

        if (!type) {
            acc.rejected.push({
                type: 'No pallet type matched',
                ...item
            });

            return acc;
        }

        if (!acc.groups[type.id]) {
            acc.groups[type.id] = {
                palletType: type,
                quantity: 0,
                items: []
            };
        }

        acc.groups[type.id].quantity += 1;
        acc.groups[type.id].items.push(item);

        return acc;
    }, {
        groups: {},
        rejected: []
    });

    return { 
        groups: Object.values(result.groups), 
        rejected: result.rejected 
    }
}

export function resolveZone(zones, postalCode, province) {
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