
const agenciesData = [
    {
        name: 'Cayco',
        code: 'cayco',
        type: 'static',
        active: true,
        rules: {
            hasAndaluciaRule: true,
            supportsPallets: true,
            supportsParcels: false
        },
        supplements: {
            fuelSurcharge: {
                enabled: true,
                type: 'percentage',
                value: 10.81
            }
        }
    },
    {
        name: 'Tecum',
        code: 'tecum',
        type: 'static',
        active: true,
        rules: {
            hasAndaluciaRule: false,
            supportsPallets: true,
            supportsParcels: false
        }
    },
    {
        name: 'Dachser',
        code: 'dachser',
        type: 'api',
        active: false,
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
            apiKey: process.env.DACHSER_API_KEY
        }
    },
    {
        name: 'Correosexpress',
        code: 'correosexpress',
        type: 'hybrid',
        active: true,
        rules: {
            hasAndaluciaRule: false,
            supportsPallets: false,
            supportsParcels: true
        },
        supplements: {
            fuelSurcharge: {
                enabled: true,
                type: 'percentage',
                value: 5
            }
        },
        apiConfig: {
            timeout: 3000,
            baseUrlApi: 'https://www.desa.cexpr.es/wspsc',
            endpoints: {
                quotations: '',
                transportOrders: ''
            },
            apiKey: 'pruebas'
        }
    },{
        name: 'Mrw',
        code: 'mrw',
        type: 'hybrid',
        active: true,
        rules: {
            hasAndaluciaRule: false,
            supportsPallets: false,
            supportsParcels: true
        },
        supplements: {
            fuelSurcharge: {
                enabled: true,
                type: 'percentage',
                value: 3.5
            }
        },
        apiConfig: {
            timeout: 3000,
            baseUrlApi: 'https://sagec-test.mrw.es/MRWEnvio.asmx',
            endpoints: {
                quotations: '',
                transportOrders: ''
            },
            apiKey: 'pruebas'
        }
    }
];

export default agenciesData;