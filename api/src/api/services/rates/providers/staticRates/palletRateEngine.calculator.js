
import {
    getEffectiveWeight,
    calculeRateByField,
    matchPrice,
    groupPallets,
    calculateFuelSurcharge,
    round
} from '../../../../utils/rateEngine.util.js';

import {
    buildStaticErrorResult, 
    buildRateResult,
    buildRateComplete,
    buildConcept, 
    buildIncident 
} from '../../domains/buildRateResult.js';

import { presentRate } from '../../presenters/rate.presenter.js';

export function buildRejectedServices(rejected) {
    if (!rejected.length) return [];

    return [
        buildRateResult({
            service: 'REJECTED_PALLET',
            transportType: 'pallet',
            incidents: rejected.map(item => (
                buildIncident('PALLET_DIMENSION_REJECTED', item)
            ))
        })
    ];
}

function calculeTonnagePricing(tonnagePricingRule, priceBase, totalWeight) {

    const price = round(priceBase);

    if (!tonnagePricingRule?.enabled) return { price, unit: '€/kg' };

    const { threshold, unit } = tonnagePricingRule;
    
    if (totalWeight < threshold) return { price, unit: '€/kg' };
    
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

        acc.push(
            buildRateResult({
                service: service.service,
                transportType: 'pallet',
                itemCount: palletItems.length,
                totalWeight,
                concepts: [
                    buildConcept(
                        'BASE', 
                        price, 
                        { 
                            unit,
                            pricingType: zone.pricingMode?.type
                        }
                    )
                ]
            })
        );

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

            acc.push(
                buildRateResult({
                    service: service.service,
                    transportType: 'pallet',
                    itemCount: group.quantity,
                    concepts: [
                        buildConcept(
                            'BASE', 
                            total, 
                            {
                                palletType: group.palletType.name,
                                quantity: group.quantity,
                                unitPrice,
                                items: group.items
                            })
                        ]
                    })
                );

            return acc;
        }, []);
    });
}

function calculateSinglePallet({  palletItems, agencyRates, agencyPalletTypes, zone, agencySupplements }) {
    const { groups, rejected } = groupPallets(palletItems, agencyPalletTypes);

    return [
        ...calculateGroupServices({
            groups,
            agencyRates,
            zone,
            agencySupplements
        }),
        ...buildRejectedServices(rejected)
    ];
}

export function calculatePallet(params) {
    const { nameAgency, zone } = params;
    
    const services = (zone.pricingMode.type === 'weight_volume')
        ? presentRate(calculateWeightVolume({ ...params }))
        : presentRate(calculateSinglePallet({ ...params }));

    if (services.length === 0) {
        return buildStaticErrorResult({
            presentRate,
            agency: nameAgency,
            code: 'NO_RATE'
        });
    }

    return buildRateComplete({
        agency: nameAgency,
        zone: zone.name,
        services
    });
};