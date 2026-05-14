
import {
    getEffectiveWeight,
    calculeRateByField,
    matchPrice,
    groupPallets,
    calculateFuelSurcharge,
    round
} from '../../../utils/rateEngine.util.js';

function buildRejectedServices(rejected) {
    if (!rejected.length) return [];

    return [{
        service: "Pallet sin tarifa por dimensión",
        isRejected: true,
        breakdown: [...rejected]
    }];
}

function aggregateServices(items) {
    return Object.values(items.reduce((acc, item) => {

        if (!acc[item.service]) {
            acc[item.service] = {
                service: item.service,
                total: 0,
                breakdown: []
            };
        }

        acc[item.service].total = 
            round(acc[item.service].total + item.total);
        acc[item.service].breakdown.push(item.breakdown);

        return acc;
    }, {}));
}

function calculeTonnagePricing(tonnagePricingRule, priceBase, totalWeight) {

    const price = round(priceBase);

    if (!tonnagePricingRule?.enabled) {
        return { price, unit: '€/kg' };
    }

    const { threshold, unit } = tonnagePricingRule;

    if (totalWeight < threshold) {
        return { price, unit: '€/kg' };
    }

    return { 
        price: round(( totalWeight / 1000 ) * price),
        unit 
    };
}

function calculePricing(agencySupplements, tonnagePricingRule, priceBase, totalWeight) {

    const fuelExtraCost = 
            calculateFuelSurcharge(agencySupplements, priceBase);

    return calculeTonnagePricing(
        tonnagePricingRule, 
        priceBase + fuelExtraCost, 
        totalWeight
    );
}

function calculateWeightVolume({ palletItems, agencyRates, zone, agencySupplements }) {
    const totalWeight = palletItems.reduce((sum, item) => 
        sum + getEffectiveWeight(item), 0
    );
    
    const rateMap = calculeRateByField(agencyRates);
    const rate = rateMap.get(`${zone.name}_pallet`);
    if (!rate) return [];

    return rate.services.reduce((acc, service) => {
        const match = matchPrice(service.priceBreaks, totalWeight);
        if (!match) return acc;

        const { price, unit } = 
            calculePricing(
                agencySupplements,
                zone.pricingMode?.tonnagePricingRule, 
                match.price, 
                totalWeight
            );

        acc.push({
            service: service.service,
            total: price,
            breakdown: [{
                type: zone.pricingMode?.type,
                unit,
                totalWeight,
                price
            }]
        });

        return acc;
    }, []);
};

function calculateGroupServices({ 
    groups,
    agencyRates,
    zone,
    agencySupplements 
}) {
    const rateMap = calculeRateByField(agencyRates, 'palletTypeId');
 
    return groups.flatMap(group => {
        const rate = rateMap.get(`${zone.name}_${group.palletType.id}`);
        if (!rate) return [];
        
        return rate.services.reduce((acc, service) => {
            const match = matchPrice(service.priceBreaks, group.quantity);
            if (!match?.price) return acc;

            const fuelExtraCost = 
                calculateFuelSurcharge(agencySupplements, match.price);

            const unitPrice = round(match.price + fuelExtraCost);
            
            const total = rate.calculationType === "quantity"
                ? round((match.price + fuelExtraCost) * group.quantity)
                : round((match.price + fuelExtraCost) * group.quantity);

            acc.push({
                service: service.service,
                total,
                breakdown: {
                    type: "pallet",
                    palletType: group.palletType.name,
                    quantity: group.quantity,
                    unitPrice,
                }
            });

            return acc;
        }, []);
    });
}

function calculateSinglePallet({  palletItems, agencyRates, agencyPalletTypes, zone, agencySupplements }) {
    const { groups, rejected } = groupPallets(palletItems, agencyPalletTypes);

    const calculatedServices = calculateGroupServices({
        groups,
        agencyRates,
        zone,
        agencySupplements
    });

    return [
        ...aggregateServices(calculatedServices),
        ...buildRejectedServices(rejected)
    ];
}

export function calculatePallet(params) {
    const { zone } = params;

    return (zone.pricingMode.type === 'weight_volume')
        ? calculateWeightVolume({ ...params })
        : calculateSinglePallet({ ...params });
};