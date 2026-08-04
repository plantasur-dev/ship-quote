
import { calculateVolumeM3 } from '../../../../../lib/utils/rate.utils.js';

export function getEffectiveWeight(item, volumetricFactor) {

    const volumeM3 = calculateVolumeM3(item);

    const calculateVolumenWeight = 
        (!volumetricFactor?.enabled) 
            ? volumeM3 
            : volumeM3 * volumetricFactor.factor;

    return Math.max(item.weight, calculateVolumenWeight);
}

export function classifyPallet(item, palletTypes) {
    const effectiveWeight = getEffectiveWeight(item);

    for (const type of palletTypes) {
        const c = type.constraints;

        const fitsWeight = !c.maxWeight || effectiveWeight <= c.maxWeight;
        const fitsLength = !c.maxLength || item.large <= c.maxLength;
        const fitsWidth  = !c.maxWidth  || item.width  <= c.maxWidth;
        const fitsHeight = !c.maxHeight || item.height <= c.maxHeight;

        if (fitsWeight && fitsLength && fitsWidth && fitsHeight) {
            return type;
        }
    }

    return null;
}

export function groupPallets(items, palletTypes) {

    const groups = new Map();
    const rejected = [];

    for (const item of items) {

        const type = classifyPallet(item, palletTypes);

        if (!type) {
            rejected.push({
                type: 'No pallet type matched',
                ...item
            });
            continue;
        }

        const existing = groups.get(type._id);

        if (existing) {
            existing.quantity++;
            existing.items.push(item);
        } else {
            groups.set(type._id, {
                palletType: type,
                quantity: 1,
                items: [item]
            });
        }
    }

    return {
        groups: [...groups.values()],
        rejected
    };

}