
export const mrwZones = {
    NACIONAL: {
        name: "NACIONAL",
        provinces: [
            "ES-J","ES-CO","ES-AB", "ES-AL", "ES-CR", "ES-SE", "ES-MA",
            "ES-BA", "ES-CU", "ES-H", "ES-MU", "ES-A", "ES-CA", "ES-GR",
            "ES-GU", "ES-M", "ES-SO", "ES-TO", "ES-AV", "ES-BU", "ES-LO", 
            "ES-SG", "ES-VA", "ES-Z", "ES-VI", "ES-HU", "ES-LE", "ES-NA", 
            "ES-P", "ES-SA", "ES-TE", "ES-V", "ES-ZA", "ES-CS", "ES-SS", 
            "ES-L", "ES-O", "ES-S", "ES-T", "ES-BI", "ES-B", "ES-CC",
            "ES-C", "ES-GI", "ES-LU", "ES-OR", "ES-PO"
        ],
        calculationMode: "parcel",
        pricingMode: { type: "weight" },
        postalCodeExceptions: []
    }
}

export const mrwRates = {
    NACIONAL: {
        service: "basic",
        priceBreaks: [
            { min: 0, max: 2, price: 3.78 },
            { min: 3, max: 5, price: 3.98 },
            { min: 6, max: 10, price: 5.19 },
            { min: 11, max: 15, price: 7.54 },
            { min: 16, max: 20, price: 8.25 },
            { min: 21, max: 25, price: 9.09 },
            { min: 26, max: 30, price: 11.55 },
            { min: 31, max: 35, price: 13.09 },
            { min: 36, max: 40, price: 14.41 }
        ],
        surcharges: {
            extraKg: {
                enabled: false,
                pricePerKg: 0
            },
            dimensionRanges: [
                { min: 150, max: 200, price: 2.55 }, 
                { min: 200, max: 250, price: 3.84 }, 
                { min: 250, max: 300, price: 26.56 }
            ],
            multiParcelExcess: {
                enabled: true,
                thresholdKg: 40,
                divisor: 5,
                pricePerBlock: 4.15
            }
        },
        limits: {
            maxWeight: 40,
            maxLength: 300,
            maxSumDimensions: 300
        }
    }
}