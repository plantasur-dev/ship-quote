
export const mrwZones = {
    NACIONAL: {
        name: "NACIONAL",
        provinces: [
            "ES-ZA", "ES-Z", "ES-VA", "ES-VI",
            "ES-V", "ES-TO", "ES-T", "ES-TE",
            "ES-SA", "ES-SG", "ES-SO", "ES-SS",
            "ES-O", "ES-OR", "ES-P", "ES-PO",
            "ES-S", "ES-A", "ES-J", "ES-CA", "ES-CO", "ES-H", "ES-SE", "ES-AL", "ES-MA","ES-GR"
        ],
        calculationMode: "parcel",
        pricingMode: "weight",
        postalCodeExceptions: []
    }
}

export const mrwRates = {
    PROVINCIAL: {
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
        extraKg: 0.24,
        constraints: {
            maxWeight: 40,
            maxLength: 150,
            maxSumDimensions: 240
        }
    }
}

150-200	2,55 €
200-250	3,84 €
250-300	26,56 €
