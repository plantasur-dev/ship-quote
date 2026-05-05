
// Volumen en m3
export function calculateVolume(item) {
    return (item.large * item.width * item.height) / 1000000;
}

// Peso volumétrico (estándar transporte)
export function calculateVolumetricWeight(item) {
    return (item.large * item.width * item.height) / 5000;
}

// Peso efectivo
export function getEffectiveWeight(item) {
    return Math.max(item.weight, calculateVolume(item));
}

// Clasificación pallet
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

// Agrupar pallets
export function groupPallets(items, palletTypes) {
    const groups = {};

    items.forEach(item => {
        const type = classifyPallet(item, palletTypes);

        if (!type) return;

        if (!groups[type.id]) {
            groups[type.id] = {
                palletType: type,
                quantity: 0,
                items: []
            };
        }

        groups[type.id].quantity += 1;
        groups[type.id].items.push(item);
    });

    return Object.values(groups);
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

export function calculateWeightVolume({ palletItems, agencyRates, zone }) {
    const totalWeight = palletItems.reduce((sum, item) => 
        sum + getEffectiveWeight(item), 0
    );

    const rateMap = calculeRateByField(agencyRates);
    const rate = rateMap.get(`${zone.name}_pallet`);
    if (!rate) return [];

    return rate.services.reduce((acc, service) => {
        const match = matchPrice(service.priceBreaks, totalWeight);
        if (!match) return acc;

        acc.push({
            service: service.service,
            total: match.price,
            breakdown: [{
                type: "weight_volume",
                totalWeight,
                price: match.price
            }]
        });

        return acc;
    }, []);
};

export function calculatePallet({ palletItems, agencyRates, agencyPalletTypes, zone }) {
    const groups = groupPallets(palletItems, agencyPalletTypes);
    const rateMap = calculeRateByField(agencyRates, 'palletTypeId');

    const results = groups.flatMap(group => {
        const rate = rateMap.get(`${zone.name}_${group.palletType.id}`);
        if (!rate) return [];

        return rate.services.reduce((acc, service) => {
            const match = matchPrice(service.priceBreaks, group.quantity);
            if (!match?.price) return acc;

            const total = rate.calculationType === "quantity"
                ? match.price * group.quantity
                : match.price;

            acc.push({
                service: service.service,
                total: total * group.quantity,
                breakdown: {
                    type: "pallet",
                    palletType: group.palletType.name,
                    quantity: group.quantity,
                    unitPrice: match.price,
                }
            });

            return acc;
        }, []);
    });

    return aggregateServices(results);
};

function aggregateServices(items) {
    return Object.values(items.reduce((acc, item) => {

        if (!acc[item.service]) {
            acc[item.service] = {
                service: item.service,
                total: 0,
                breakdown: []
            };
        }

        acc[item.service].total += item.total;
        acc[item.service].breakdown.push(item.breakdown);

        return acc;
    }, {}));
}