
export const SCHEMA_VERSION = 1;

export const groupOf = palletType => palletType.tariffGroup ?? palletType.name;

export function toNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return value;

    let text = value.trim();
    if (text === '') return undefined;

    if (/^-?\d+(\.\d{3})*(,\d+)?$/.test(text) && text.includes(',')) {
        text = text.replace(/\./g, '').replace(',', '.');
    } else {
        text = text.replace(',', '.');
    }

    const number = Number(text);
    return Number.isNaN(number) ? value : number;
}

export function expandRates(pkg) {
    const typesByGroup = new Map();
    for (const palletType of pkg.palletTypes) {
        const group = groupOf(palletType);
        if (!typesByGroup.has(group)) typesByGroup.set(group, []);
        typesByGroup.get(group).push(palletType);
    }

    const expanded = [];
    const orphans = [];

    for (const rate of pkg.rates) {
        if (!rate.palletType) {
            expanded.push({ ...rate, palletTypeRef: null });
            continue;
        }

        const types = typesByGroup.get(rate.palletType);

        if (!types) {
            orphans.push(rate);
            continue;
        }

        for (const palletType of types) {
            expanded.push({ ...rate, palletTypeRef: palletType });
        }
    }

    return { expanded, orphans, typesByGroup };
}