
import {
    getEffectiveWeight,
    calculateVolumetricWeight,
    calculeRateByField,
    matchPrice,
    groupPallets,
    findRate
} from '../../utils/rateEngine.util.js';

const buildParcelError = (message = '') => ({
    service: `No hay tarifa disponible`,
    total: 0,
    breakdown: [{ type: message || "No hay tarifa disponible para las dimensiones" }]
});

const buildParcelOverweight = (index, maxWeight, itemWeight) => ({
    service: `Fuera tarifa (Exceso peso) - Paquete ${ index + 1 }`,
    total: 0,
    breakdown: [{
        type: `Superior al peso máximo: ${ maxWeight } kg`,
        totalWeight: itemWeight
    }]
});

const round = (num) => Number(num.toFixed(2));

function resolveParcelPrice({ totalWeight, service }) {
    const { priceBreaks, extraKg = 0 } = service;

    const match = matchPrice(priceBreaks, totalWeight);
    if (match) {
        return {
            calculeType: 'base',
            weight: totalWeight,
            price: match.price
        };
    }

    const last = priceBreaks?.[priceBreaks.length - 1];
    if (!last || !extraKg) return null;

    const excessWeight = totalWeight - last.max;
    if (excessWeight <= 0) return null;

    const extraCost = excessWeight * extraKg;

    return {
        calculeType: 'extra',
        basePrice: last.price,
        extraCost,
        excessWeight
    };
}

function formatParcelResult({ result, serviceName, index, itemWeight, totalWeight, itemCount }) {
    if (!result) {
        if (typeof index === 'number') {
            return {
                service: `No hay tarifa disponible - Paquete ${ index + 1 }`,
                total: 0,
                breakdown: [{
                    type: "No hay tarifa disponible para las dimensiones"
                }]
            };
        }

        return buildParcelError();
    }

    if (result.calculeType === 'base') {
        return {
            service: typeof index === 'number'
                ? `${ serviceName } - Paquete ${ index + 1 }`
                : serviceName,
            total: result.price,
            breakdown: [{
                type: "parcel",
                totalWeight: totalWeight ?? itemWeight,
                items: itemCount,
                price: result.price
            }]
        };
    }

    const total = round(result.basePrice + result.extraCost);

    return {
        service: typeof index === 'number'
            ? `${ serviceName } - Paquete ${ index + 1 }`
            : serviceName,
        total,
        breakdown: [
            {
                type: "parcel",
                totalWeight: totalWeight ?? itemWeight,
                items: itemCount,
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

function calculateWeightVolume({ palletItems, agencyRates, zone }) {
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

function calculateSinglePallet({ palletItems, agencyRates, agencyPalletTypes, zone }) {
    const groups = groupPallets(palletItems, agencyPalletTypes);
    const rateMap = calculeRateByField(agencyRates, 'palletTypeId');

    const results = groups.flatMap(group => {
        const rate = rateMap.get(`${zone.name}_${group.palletType.id}`);
        if (!rate) return [];

        return rate.services.reduce((acc, service) => {
            const match = matchPrice(service.priceBreaks, group.quantity);
            if (!match?.price) return acc;

            const total = rate.calculationType === "quantity"
                ? match.price
                : match.price * group.quantity;

            acc.push({
                service: service.service,
                total,
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

function calculateSingleParcel({ parcelItems, agencyRates, zone }) {
    if (!parcelItems?.length) return [];

    const rate = findRate(agencyRates, { zoneName: zone.name, type: 'parcel' });
    if (!rate) return [];

    return parcelItems.flatMap((item, index) => {
        const currentWeight = Number(item.weight || 0);
        const volumetricWeight = getEffectiveWeight(item, 6000);
        const itemWeight = zone.pricingMode === 'weight_volume'
            ? volumetricWeight
            : currentWeight;

        const large = item.large || 0;
        const width = item.width || 0;
        const height = item.height || 0;
        const sumDimensions = Number(large) + Number(width) + Number(height);

        return rate.services.map(service => {
            const { service: serviceName, constraints = {} } = service;
            const maxWeight = constraints.maxPieceWeight || constraints.maxWeight;

            if (constraints.maxLength && large > constraints.maxLength) {
                return formatParcelResult({ result: null, serviceName, index, itemWeight });
            }

            if (constraints.maxSumDimensions && sumDimensions > constraints.maxSumDimensions) {
                return formatParcelResult({ result: null, serviceName, index, itemWeight });
            }

            if (maxWeight && itemWeight > maxWeight) {
                return buildParcelOverweight(index, maxWeight, itemWeight);
            }

            const result = resolveParcelPrice({ totalWeight: itemWeight, service });

            return formatParcelResult({
                result,
                serviceName,
                index,
                itemWeight
            });
        });
    });
};

function calculateMultiParcel({ parcelItems, agencyRates, zone }) {
    if (!parcelItems?.length) return [];

    const rate = findRate(agencyRates, { zoneName: zone.name, type: 'parcel' });
    if (!rate) return [];

    return rate.services.flatMap(service => {
        const { service: serviceName, constraints = {}, volumetricDivisor = 6000 } = service;

        const items = parcelItems.map(item => {
            const itemWeight = Number(item.weight || 0);
            const length = item.large || item.length || 0;
            const width = item.width || 0;
            const height = item.height || 0;
            const volWeight = calculateVolumetricWeight(item, volumetricDivisor);
            const sumDimensions = length + width + height;

            return {
                itemWeight,
                volWeight,
                length,
                sumDimensions
            };
        });

        const maxPieceWeight = constraints.maxPieceWeight || constraints.maxWeight;
        if (maxPieceWeight && items.some(i => i.itemWeight > maxPieceWeight)) {
            return [];
        }

        if (constraints.maxLength && items.some(i => i.length > constraints.maxLength)) {
            return [];
        }

        if (constraints.maxSumDimensions && items.some(i => i.sumDimensions > constraints.maxSumDimensions)) {
            return [];
        }

        const totalActualWeight = items.reduce((sum, item) => sum + item.itemWeight, 0);
        const totalVolumetricWeight = items.reduce((sum, item) => sum + item.volWeight, 0);
        const totalWeight = zone.pricingMode === 'weight_volume'
            ? Math.max(totalActualWeight, totalVolumetricWeight)
            : totalActualWeight;

        const maxTotalWeight = constraints.maxTotalWeight || constraints.maxWeight;
        if (maxTotalWeight && totalWeight > maxTotalWeight) {
            return [];
        }

        const result = resolveParcelPrice({ totalWeight, service });
        if (!result) return [];

        return formatParcelResult({
            result,
            serviceName,
            totalWeight: round(totalWeight),
            itemCount: parcelItems.length
        });
    });
}

export function calculatePallet({ palletItems, agencyRates, agencyPalletTypes, zone }) {
    return (zone.pricingMode === 'weight_volume')
        ? calculateWeightVolume({ 
                palletItems, 
                agencyRates, 
                zone 
            })
        : calculateSinglePallet({ 
                palletItems, 
                agencyRates, 
                agencyPalletTypes, 
                zone 
            });
};

export function calculateParcel({ parcelItems, agencyRates, zone }) {
    if (!parcelItems?.length) return [];
        
    return (parcelItems.length === 1) 
        ? calculateSingleParcel({ parcelItems, agencyRates, zone })
        : calculateMultiParcel({ parcelItems, agencyRates, zone });
}