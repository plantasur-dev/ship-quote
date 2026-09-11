
import {
    buildStaticErrorResult,
    buildRateComplete 
} from '../../domains/build.rate.result.js';

import {
    calculatePalletBasedPricing,
    calculateWeightVolume
} from './pallet.rate.utils.js';

import { PRICING_MODES } from '../../../../../lib/constants/index.js';

export function calculatePallet(params) {
    const { nameAgency, zone } = params;

    const calculators = {
        [PRICING_MODES.PALLET_CLASSIFICATION]: () => calculatePalletBasedPricing(params),
        [PRICING_MODES.WEIGHT_VOLUME]: () => calculateWeightVolume(params)
    };

    const pricingMode = zone.pricingMode.type;

    const calculator = calculators[pricingMode];

    if (!calculator) {
        throw new Error(`Unsupported calculation pricing mode ${ pricingMode }`);
    }

    const services = calculator();

    if (!services.length) {
        return buildStaticErrorResult({
            agency: nameAgency,
            zone: zone.name,
            code: 'NO_RATE'
        });
    }

    return buildRateComplete({
        agency: nameAgency,
        zone: zone.name,
        services
    });
};