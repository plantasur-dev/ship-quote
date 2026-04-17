
export const agencies = [
    {
        name: "Cayco",
        code: "cayco",
        type: "static",
        active: true,
        rules: {
            hasAndaluciaRule: true,
            supportsPallets: true,
            supportsParcels: false
        }
    },
    {
        name: "Tecum",
        code: "tecum",
        type: "static",
        active: true,
        rules: {
            hasAndaluciaRule: false,
            supportsPallets: true,
            supportsParcels: false
        }
    },
    {
        name: "Dachser",
        code: "dachser",
        type: "api",
        active: true,
        rules: {
            hasAndaluciaRule: false,
            supportsPallets: true,
            supportsParcels: false
        }
    }
];