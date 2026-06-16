
export const correosZones = {
    zones: [
        {
            name: "PENINSULAR",
            provinces: [
                "ES-J","ES-CO","ES-AB", "ES-AL", "ES-CR", "ES-SE", "ES-MA",
                "ES-BA", "ES-CU", "ES-H", "ES-MU", "ES-A", "ES-CA", "ES-GR",
                "ES-GU", "ES-M", "ES-SO", "ES-TO", "ES-AV", "ES-BU", "ES-LO", 
                "ES-SG", "ES-VA", "ES-Z", "ES-VI", "ES-HU", "ES-LE", "ES-NA", 
                "ES-P", "ES-SA", "ES-TE", "ES-V", "ES-ZA", "ES-CS", "ES-SS", 
                "ES-L", "ES-O", "ES-S", "ES-T", "ES-BI", "ES-B", "ES-CC",
                "ES-C", "ES-GI", "ES-LU", "ES-OR", "ES-PO"
            ],
        },
        {
            name: "ANDALUCIA",
            provinces: [],
        },
        {
            name: "PROVINCIAL",
            provinces: [],
        }
    ],
    calculationMode: "parcel",
    pricingMode: { type: "weight_volume" },
    postalCodeExceptions: []
}

export const correosRates = {
    PROVINCIAL: {
        service: "basic",
        priceBreaks: [
            { min: 0, max: 1, price: 3.45 },
            { min: 1, max: 2, price: 3.45 },
            { min: 2, max: 5, price: 3.83 },
            { min: 5, max: 10, price: 4.25 }
        ],
        surcharges: {
            extraKg: {
                enabled: true,
                pricePerKg: 0.24
            },
            dimensionRanges: [],
            multiParcelExcess: {
                enabled: false,
                thresholdKg: 40,
                divisor: 1,
                pricePerBlock: 0
            }
        },
        limits: {
            maxWeight: 40,
            maxLength: 150,
            maxSumDimensions: 240
        }
    },

    ANDALUCIA: {
        service: "basic",
        priceBreaks: [
            { min: 0, max: 1, price: 3.45 },
            { min: 1, max: 2, price: 3.60 },
            { min: 2, max: 5, price: 3.98 },
            { min: 5, max: 10, price: 4.40 }
        ],
        surcharges: {
            extraKg: {
                enabled: true,
                pricePerKg: 0.27
            },
            dimensionRanges: [],
            multiParcelExcess: {
                enabled: false,
                thresholdKg: 40,
                divisor: 1,
                pricePerBlock: 0
            }
        },
        limits: {
            maxWeight: 40,
            maxLength: 150,
            maxSumDimensions: 240
        }
    },

    PENINSULAR: {
        service: "basic",
        priceBreaks: [
            { min: 0, max: 1, price: 3.87 },
            { min: 1, max: 2, price: 4.00 },
            { min: 2, max: 5, price: 4.80 },
            { min: 5, max: 10, price: 5.51 }
        ],
        surcharges: {
            extraKg: {
                enabled: true,
                pricePerKg: 0.39
            },
            dimensionRanges: [],
            multiParcelExcess: {
                enabled: false,
                thresholdKg: 40,
                divisor: 1,
                pricePerBlock: 0
            }
        },
        limits: {
            maxWeight: 40,
            maxLength: 150,
            maxSumDimensions: 240
        }
    }
};