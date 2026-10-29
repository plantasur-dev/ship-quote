
import { createHash } from 'node:crypto';

function stableStringify(value) {
    if (Array.isArray(value)) {
        return `[${ value.map(stableStringify).join(',') }]`;
    }

    if (value && typeof value === 'object') {
        return `{${ Object.keys(value)
            .filter(key => value[key] !== undefined)
            .sort()
            .map(key => `${ JSON.stringify(key) }:${ stableStringify(value[key]) }`)
            .join(',') }}`;
    }

    return JSON.stringify(value);
}

const withoutOrigin = list => list.map(({ origin, ...rest }) => rest);

export function hashPackage(pkg) {
    const packageData = {
        palletTypes: pkg.palletTypes,
        zones: pkg.zones,
        exceptions: withoutOrigin(pkg.exceptions),
        rates: withoutOrigin(pkg.rates)
    };

    if (pkg.agency?.volumetric !== undefined) {
        packageData.agencyVolumetric = pkg.agency.volumetric;
    }

    return createHash('sha256')
        .update(stableStringify(packageData))
        .digest('hex');
}