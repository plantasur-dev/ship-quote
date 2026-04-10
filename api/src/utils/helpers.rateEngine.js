
// Volumen en m3
export function calculateVolume(item) {
    return (item.length * item.width * item.height) / 1000000;
}

// Peso volumétrico (estándar transporte)
export function calculateVolumetricWeight(item) {
    return (item.length * item.width * item.height) / 5000;
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
        const fitsLength = !c.maxLength || item.length <= c.maxLength;
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

        if (!groups[type._id]) {
            groups[type._id] = {
                palletType: type,
                quantity: 0,
                items: []
            };
        }

        groups[type._id].quantity += 1;
        groups[type._id].items.push(item);
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