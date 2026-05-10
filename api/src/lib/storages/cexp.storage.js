
export const correosZones = {
    PENINSULAR: {
        name: "PENINSULAR",
        provinces: [
            "ES-ZA", "ES-Z", "ES-VA", "ES-VI",
            "ES-V", "ES-TO", "ES-T", "ES-TE",
            "ES-SA", "ES-SG", "ES-SO", "ES-SS",
            "ES-O", "ES-OR", "ES-P", "ES-PO",
            "ES-S", "ES-A","ES-J", "ES-CA", 
            "ES-CO", "ES-H", "ES-SE", "ES-AL", 
            "ES-MA", "ES-GR"
        ],
        calculationMode: "parcel",
        pricingMode: "weight_volume",
        postalCodeExceptions: []
    },
    ANDALUCIA: {
        name: "ANDALUCIA",
        provinces: [],
        calculationMode: "parcel",
        pricingMode: "weight_volume",
        postalCodeExceptions: []
    },
    PROVINCIAL: {
        name: "PROVINCIAL",
        provinces: [],
        calculationMode: "parcel",
        pricingMode: "weight_volume",
        postalCodeExceptions: []
    }

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