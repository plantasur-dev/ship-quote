
import {
    getEffectiveWeight,
    calculateVolumetricWeight,
    calculeRateByField,
    matchPrice,
    groupPallets,
    findRate,
    calculateFuelSurcharge,
    matchDimensions
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

function resolveParcelPrice({ totalWeight, extraDimensionsCost, service, agencySupplements }) {
    const { priceBreaks, surcharges } = service;

    const match = matchPrice(priceBreaks, totalWeight);

    if (match) {
        const fuelExtra = 
            calculateFuelSurcharge(agencySupplements, match.price);

        return {
            calculeType: 'base',
            weight: totalWeight,
            price: round(match.price + fuelExtra + extraDimensionsCost),
            extraDimensionsCost
        };
    }

    const last = priceBreaks?.[priceBreaks.length - 1];
    if (!last || !surcharges?.extraKg?.enabled) return null;
    
    const excessWeight = totalWeight - last.max;
    if (excessWeight <= 0) return null;

    const extraCost = excessWeight * surcharges.extraKg.pricePerKg;
    
    const fuelExtraExcessWeight = 
        calculateFuelSurcharge(agencySupplements, last.price);
    
    return {
        calculeType: 'extra',
        basePrice: round(last.price + fuelExtraExcessWeight + extraDimensionsCost),
        extraCost,
        excessWeight,
        extraDimensionsCost
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
                ? `${ serviceName } - ${ itemCount > 1 ? 'MultiBulto' : 'Paquete ' + Number(index + 1) }`
                : serviceName,
            total: result.price,
            breakdown: [
                {
                    type: "parcel",
                    totalWeight: round(totalWeight ?? itemWeight),
                    items: itemCount,
                    price: result.price
                },
                ...(result.extraDimensionsCost > 0 ? [{
                    type: "extra dimensiones",
                    price: round(result.extraDimensionsCost)
                }] : [])
            ]
        };
    }

    const priceTotal = round(result.basePrice + result.extraCost);

    return {
        service: typeof index === 'number'
            ? `${ serviceName } - ${ itemCount > 1 ? 'MultiBulto' : 'Paquete ' + Number(index + 1) }`
            : serviceName,
        total: priceTotal,
        breakdown: [
            {
                type: "parcel",
                totalWeight: round(totalWeight ?? itemWeight),
                items: itemCount,
                price: result.basePrice
            },
            ...(result.extraDimensionsCost > 0 ? [{
                type: "extra dimensiones",
                price: round(result.extraDimensionsCost)
            }] : []),
            {
                type: "extra kg",
                totalWeight: round(result.excessWeight),
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

export function calculatePallet(params) {
    const { zone } = params;

    return (zone.pricingMode === 'weight_volume')
        ? calculateWeightVolume({ ...params })
        : calculateSinglePallet({ ...params });
};

export function calculateParcel({
    parcelItems,
    agencyRates,
    zone,
    agencySupplements
}) {
    if (!parcelItems?.length) return [];

    const rate = findRate(agencyRates, {
        zoneName: zone.name,
        type: 'parcel'
    });

    if (!rate) return [];

    return rate.services.flatMap((service, index) => {
        
        const { service: serviceName, surcharges, limits = {} } = service;

        const excludedPackages = [];

        const items = parcelItems.map((item, index) => {
            const weight = Number(item.weight || 0);
            const large = item.large || 0;
            const width = item.width || 0;
            const height = item.height || 0;
            const sumDimensions = Number(large) + Number(width) + Number(height);

            const maxWeight = limits.maxPieceWeight || limits.maxWeight;

            if (limits.maxLength && large > limits.maxLength) {
                excludedPackages.push(
                    formatParcelResult({ result: null, serviceName, index, weight })
                );
                return null;
            }

            if (limits.maxSumDimensions && sumDimensions > limits.maxSumDimensions) {
                excludedPackages.push(
                    formatParcelResult({ result: null, serviceName, index, weight })
                );
                return null;
            }

            if (maxWeight && weight > maxWeight) {
                excludedPackages.push(
                    buildParcelOverweight(index, maxWeight, weight)
                );
                return null;
            }

            const extraDimensions = matchDimensions(surcharges?.dimensionRanges || [], sumDimensions);

            const suppDimensions = (extraDimensions) ? extraDimensions?.price : 0;

            return { ...item, suppDimensions };
        }).filter(Boolean);

        const {
            extraDimensionsCost,
            totalItemsWeight,
            volumetric,
        } = items.reduce(
            (acc, item) => ({
                extraDimensionsCost:
                    acc.extraDimensionsCost + (item.suppDimensions || 0),

                totalItemsWeight:
                    acc.totalItemsWeight + (Number(item.weight) || 0),

                volumetric:
                    acc.volumetric + calculateVolumetricWeight(item, 6000),
            }),
            {
                extraDimensionsCost: 0,
                totalItemsWeight: 0,
                volumetric: 0,
            }
        );

        const parcelItemWeight = round(totalItemsWeight || 0);
        
        const volumetricWeight = Math.max(round(volumetric), parcelItemWeight);

        const totalWeight = Math.ceil(
            zone.pricingMode === 'weight_volume'
                ? volumetricWeight
                : parcelItemWeight
        );
        
        const result = resolveParcelPrice({ 
            totalWeight, 
            extraDimensionsCost, 
            service, 
            agencySupplements 
        });

        const ratedPackages = formatParcelResult({
            result,
            serviceName,
            index,
            itemWeight: totalWeight,
            itemCount: items.length
        });
        
        return [
            ratedPackages,
            ...excludedPackages
        ];
    });
}