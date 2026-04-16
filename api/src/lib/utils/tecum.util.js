
export const ex = (from, to, zoneName) => ({ from, to, zoneName });

export const fixed = (price) => [{ min: 1, max: 999, price }];

export const buildPriceBreaks = (prices = []) => {
    return prices
        .map((price, i) => ({
            min: i + 1,
            max: i + 1,
            price
        }))
        .filter(p => p.price !== '' && p.price !== null && p.price !== undefined);
};

export const palletMap = [
    "MINI QUARTER PALLET",
    "QUARTER PALLET",
    "SUPER EURO LIGHT PALLET",
    "HALF PALLET"
];