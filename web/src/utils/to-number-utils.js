
export const toNumber = (value, defaultValue = 0) => {
    if (value === "" || value === null || value === undefined) {
        return defaultValue;
    }

    const number = Number(value);

    return Number.isNaN(number) ? defaultValue : number;
};