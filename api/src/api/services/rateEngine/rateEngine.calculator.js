
import {
    getEffectiveWeight,
    calculeRateByField,
    matchPrice,
    groupPallets,
    findRate
} from '../../utils/rateEngine.util.js';

function resolveParcelPrice({ index, itemWeight, service }) {
    const { priceBreaks, extraKg = 0 } = service;

    const match = matchPrice(priceBreaks, itemWeight);
    if (match) {
        return {
            calculeType: 'base',
            weight: itemWeight,
            price: match.price
        };
    }

    const last = priceBreaks?.[priceBreaks.length - 1];
    if (!last || !extraKg) return buildParcelError(index);

    const excessWeight = itemWeight - last.max;
    
    const extraCost = excessWeight * extraKg;

    return {
        calculeType: 'extra',
        basePrice: last.price,
        extraCost,
        excessWeight
    };
}

function formatParcelResult({ result, serviceName, index, itemWeight }) {
    if (!result) {
        return {
            service: `No hay tarifa disponible - Paquete ${ index + 1 }`,
            total: 0,
            breakdown: [{
                type: "No hay tarifa disponible para las dimensiones"
            }]
        };
    }

    if (result.calculeType === 'base') {
        return {
            service: `${ serviceName } - Paquete ${ index + 1 }`,
            total: result.price,
            breakdown: [{
                type: "parcel",
                totalWeight: itemWeight,
                price: result.price
            }]
        };
    }

    if (result.calculeType === 'extra') {
        const total = result.basePrice + result.extraCost;

        return {
            service: `${ serviceName } - Paquete ${ index + 1 }`,
            total: round(total),
            breakdown: [
                {
                    type: "parcel",
                    totalWeight: itemWeight,
                    price: result.basePrice
                },
                {
                    type: "extra kg",
                    totalWeight: result.excessWeight,
                    price: round(result.extraCost)
                }
            ]
        };
    }
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

        acc[item.service].total += item.total;
        acc[item.service].breakdown.push(item.breakdown);

        return acc;
    }, {}));
}

const buildParcelError = (index, message = '') => ({
    service: `No hay tarifa disponible - Paquete ${ index + 1 }`,
    total: 0,
    breakdown: [{ type: message }]
});

const buildParcelOverweight = (index, maxWeight, itemWeight) => ({
    service: `Fuera tarifa (Exceso peso) - Paquete ${ index + 1 }`,
    total: 0,
    breakdown: [{
        type: `Superior al peso máximo: ${ maxWeight } kg`,
        totalWeight: itemWeight
    }]
});

const round = (num) => num.toFixed(2);

export function calculateWeightVolume({ palletItems, agencyRates, zone }) {
    const totalWeight = palletItems.reduce((sum, item) => 
        sum + getEffectiveWeight(item), 0
    );

    const rateMap = calculeRateByField(agencyRates);
    const rate = rateMap.get(`${zone.name}_pallet`);
    if (!rate) return [];

    return rate.services.reduce((acc, service) => {
        const match = matchPrice(service.priceBreaks, totalWeight);
        if (!match) return acc;

        acc.push({
            service: service.service,
            total: match.price,
            breakdown: [{
                type: "weight_volume",
                totalWeight,
                price: match.price
            }]
        });

        return acc;
    }, []);
};

export function calculatePallet({ palletItems, agencyRates, agencyPalletTypes, zone }) {
    const groups = groupPallets(palletItems, agencyPalletTypes);
    const rateMap = calculeRateByField(agencyRates, 'palletTypeId');

    const results = groups.flatMap(group => {
        const rate = rateMap.get(`${zone.name}_${group.palletType.id}`);
        if (!rate) return [];

        return rate.services.reduce((acc, service) => {
            const match = matchPrice(service.priceBreaks, group.quantity);
            if (!match?.price) return acc;

            const total = rate.calculationType === "quantity"
                ? match.price * group.quantity
                : match.price;

            acc.push({
                service: service.service,
                total: total * group.quantity,
                breakdown: {
                    type: "pallet",
                    palletType: group.palletType.name,
                    quantity: group.quantity,
                    unitPrice: match.price,
                }
            });

            return acc;
        }, []);
    });

    return aggregateServices(results);
};

export function calculateParcel({ parcelItems, agencyRates, zone }) {
    if (!parcelItems?.length) return [];

    const rate = findRate(agencyRates, { zoneName: zone.name, type: 'parcel' });
    if (!rate) return [];

    return parcelItems.flatMap((item, index) => {
        const itemWeight = Number(item.weight || 0);
       
        return rate.services.map(service => {
            const { service: serviceName, constraints = {} } = service;

            if (constraints.maxWeight && itemWeight > constraints.maxWeight) {
                return buildParcelOverweight(index, constraints.weight, itemWeight);
            }

            const result = resolveParcelPrice({ index, itemWeight, service });

            return formatParcelResult({ 
                result, 
                serviceName, 
                index, 
                itemWeight 
            });
        });
    });
};