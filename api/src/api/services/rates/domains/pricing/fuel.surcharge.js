
export function applyFuelSurcharge(baseAmount, supplements) {
    const fuel = supplements?.fuelSurcharge;

    if (!fuel?.enabled || !fuel.value) return 0;

    if (fuel.type === 'percentage') {
        return baseAmount * (fuel.value / 100);
    }

    if (fuel.type === 'fixed') {
        return fuel.value;
    }

    return 0;
}
