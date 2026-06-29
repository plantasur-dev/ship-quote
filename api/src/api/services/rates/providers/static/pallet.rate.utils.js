
import {
    getEffectiveWeight,
    groupPallets,
    matchPrice,
    calculateFuelSurcharge,
    round
} from '../../../../../lib/utils/rate.utils.js';

import {
    buildRateResult,
    buildConcept, 
    buildIncident,
    buildRejectedServices
} from '../../domains/build.rate.result.js';

import {
    SHIPMENT_UNITS
} from '../../../../../lib/constants/index.js';

export function calculateTonnagePricing(tonnagePricingRule, priceBase, totalWeight) {

    const price = round(priceBase);

    if (!tonnagePricingRule?.enabled) return { price, unit: '€/kg' };

    const { threshold, unit } = tonnagePricingRule;
    
    if (totalWeight < threshold) return { price, unit: '€/kg' };
    
    return { 
        price: round(( totalWeight / 1000 ) * price),
        unit 
    };
}

export function calculatePricing(agencySupplements, tonnagePricingRule, priceBase, totalWeight) {
    
    const fuelExtraCost = 
        calculateFuelSurcharge(agencySupplements, priceBase);

    return calculateTonnagePricing(
        tonnagePricingRule, 
        priceBase + fuelExtraCost, 
        totalWeight
    );
}

export function calculateWeightVolume({ palletItems, agencyRates, zone, agencySupplements }) {
    
    const totalWeight = palletItems.reduce((sum, item) => 
        sum += getEffectiveWeight(item, zone?.volumetric)
        , 0
    );

    const rate = agencyRates.get(`${zone.calculationMode}|${zone.name}|none`);
    if (!rate) return [];

    return rate.services.reduce((acc, service) => {
        const match = matchPrice(service.priceBreaks, totalWeight);
        if (!match) return acc;
        
        const { price, unit } = 
            calculatePricing(
                agencySupplements,
                zone.pricingMode?.tonnagePricingRule, 
                match.price, 
                totalWeight
            );

        acc.push(
            buildRateResult({
                service: service.service,
                transportType: SHIPMENT_UNITS.PALLET,
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

export function calculateGroupServices({ 
    groups,
    agencyRates,
    zone,
    agencySupplements 
}) {
    return groups.flatMap(group => {
        const rate = agencyRates.get(`${zone.calculationMode}|${zone.name}|${group.palletType._id.toString()}`);
        if (!rate) return [];
        
        return rate.services.reduce((acc, service) => {
            const match = matchPrice(service.priceBreaks, group.quantity);
            
            if (!match) {
                acc.push(
                    buildRateResult({
                        service: service.service,
                        transportType: SHIPMENT_UNITS.PALLET,
                        itemCount: group.quantity,
                        incidents: [
                            buildIncident(
                                'NO_RATE', 
                                { 
                                    items: group.items 
                                }
                            )
                        ]
                    })
                );

                return acc;
            }

            const fuelExtraCost = 
                calculateFuelSurcharge(agencySupplements, match.price);

            const unitPrice = 
                round(match.price + fuelExtraCost);
            
            const total = 
                round((match.price + fuelExtraCost) * group.quantity);

            acc.push(
                buildRateResult({
                    service: service.service,
                    transportType: SHIPMENT_UNITS.PALLET,
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

export function calculateSinglePallet({  palletItems, agencyRates, agencyPalletTypes, zone, agencySupplements }) {
    const {  groups = [], rejected = [] } = groupPallets(palletItems, agencyPalletTypes) || {};
    
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