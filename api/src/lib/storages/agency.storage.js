
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
        },
        apiConfig: {
            timeout: 3000,
            baseUrlApi: 'https://api-gateway.dachser.com/rest/v2',
            endpoints: {
                quotations: '/quotations',
                transportOrders: ''
            },
            apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiaS5iMmIucG9ydGFsIiwiZXhwIjoxNzc3MjgzNjE2LCJjdXN0b21lck51bWJlciI6NDYzMzM0NjEsImN1c3RvbWVyTmFtZSI6IlBydWViYSJ9.dak3h0b4urZxva4rDQ12YoIlq7efiPIddGsJaKWaW7k'
        }
    }
];