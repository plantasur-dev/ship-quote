
export function fixedPrice(price) {
    return [{ min: 1, max: 999, price }];
}

export function buildBreaks(prices) {
    return prices
        .map((price, i) => ({
            min: i + 1,
            max: i + 1,
            price
        })
    );
}

export function buildWeightBreaks(data) {
    return data
        .map((item, i) => {
            const min = i === 0 ? 0 : data[i - 1][0] + 1;
            const max = item[0];
            
            return { min, max, price: item[1] };
        });
}

export function buildVolumenBreaks(data) {
    return data
        .map(([min, price], i) => {
            const next = data[i + 1];
            const max = next ? next[0] - 1 : 1000000;

            return { min, max, price };
        });
}