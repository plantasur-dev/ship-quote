
import {
    getEffectiveWeight,
    groupPallets
} from '../../domains/pallet/pallet.rules.js';

import {
    matchPrice,
    calculateTonnagePricing
} from '../../domains/pricing/pricing.rules.js';

import {
    buildRateResult,
    buildConcept, 
    buildIncident,
    buildRejectedServices
} from '../../domains/build.rate.result.js';

import {
    SHIPMENT_UNITS
} from '../../../../../lib/constants/index.js';

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
            calculateTonnagePricing(
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
                ],
                agencySupplements
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
            const pricesRate = service.priceBreaks;
            const quantityPallet = group.quantity;
            const fallbackToLastPrice = service?.fallbackToLastPrice;

            const match = matchPrice(
                pricesRate, 
                quantityPallet, 
                fallbackToLastPrice
            );
            
            if (!match) {
                acc.push(
                    buildRateResult({
                        service: service.service,
                        transportType: SHIPMENT_UNITS.PALLET,
                        itemCount: quantityPallet,
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

            const unitPrice = match.price;
            const total = match.price * quantityPallet;

            acc.push(
                buildRateResult({
                    service: service.service,
                    transportType: SHIPMENT_UNITS.PALLET,
                    itemCount: quantityPallet,
                    concepts: [
                        buildConcept(
                            'BASE', 
                            total, 
                            {
                                palletType: group.palletType.name,
                                quantity: quantityPallet,
                                unitPrice,
                                items: group.items
                            })
                        ],
                        agencySupplements
                    })
                );

            return acc;
        }, []);
    });
}

export function calculatePalletBasedPricing({  palletItems, agencyRates, agencyPalletTypes, zone, agencySupplements }) {
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