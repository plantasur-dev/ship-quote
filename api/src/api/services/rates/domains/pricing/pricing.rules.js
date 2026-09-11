
import { fixedToN } from '../../../../../lib/utils/rate.utils.js';

export function matchPrice(priceRanges, lookupValue, fallbackToLastPrice = false) {

    if (!Array.isArray(priceRanges) || !priceRanges.length) {
        return undefined;
    }
    
    const match = priceRanges.find(breakRange => 
        lookupValue >= breakRange.min && 
        lookupValue <= breakRange.max
    );
    
    if (match && !match.price) {
        return undefined;
    }

    if (!match) {
        const breakPrices = priceRanges[priceRanges.length - 1];

        if (fallbackToLastPrice && lookupValue > breakPrices.max) {
            return breakPrices;
        }

        return undefined;
    }

    return match;
}

export function calculateTonnagePricing(tonnagePricingRule, priceBase, totalWeight) {

    const price = fixedToN(priceBase);

    if (!tonnagePricingRule?.enabled) return { price, unit: '€/kg' };

    const { threshold, unit } = tonnagePricingRule;
    
    if (totalWeight < threshold) return { price, unit: '€/kg' };
    
    return { 
        price: fixedToN(( totalWeight / 1000 ) * price),
        unit 
    };
}

export function calculateExcessWeight(extraKg, excessWeight) {

    if (!extraKg?.enabled) return 0;

    return excessWeight * extraKg.pricePerKg;
}

export function calculateAdditionalWeightBlockCost(multiParcelExcess, totalWeight) {

    if(!multiParcelExcess?.enabled) return 0;

    const { thresholdKg, divisor, pricePerBlock } = multiParcelExcess;

    if(totalWeight <= thresholdKg) return 0;
    
    const excessWeight = totalWeight - thresholdKg;
    const numBlocks = Math.ceil(excessWeight / divisor);

    return (numBlocks * pricePerBlock || 0);
}

export function calculateFixedSurcharge(fixedSurcharge, quantityParcel = 0) {
    
    if (!fixedSurcharge?.enabled) return 0;

    if (fixedSurcharge?.calculateByQuantity) {
        return fixedSurcharge.price * quantityParcel;
    }

    return fixedSurcharge.price;
}