
import { fixedToN } from '../../../../../lib/utils/rate.utils.js';

export function matchPrice(breaks, packageWeight, fallbackToLastPrice = false) {

    if (!Array.isArray(breaks) || !breaks.length) {
        return undefined;
    }
    
    const match = breaks.find(weight => 
        packageWeight >= weight.min && 
        packageWeight <= weight.max
    );
    
    if (match && !match.price) {
        return undefined;
    }

    if (!match) {
        const breakPrices = breaks[breaks.length - 1];

        if (fallbackToLastPrice && packageWeight > breakPrices.max) {
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