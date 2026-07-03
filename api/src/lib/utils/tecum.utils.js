
export const buildPriceBreaks = (prices = []) => {
    return prices
        .map((price, i) => ({
            min: i + 1,
            max: i + 1,
            price
        }))
        .filter(p => p.price !== '' && p.price !== null && p.price !== undefined);
};