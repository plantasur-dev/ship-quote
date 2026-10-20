function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, clone(item)])
        );
    }
    return value;
}

function mergeObjects(...objects) {
    return objects.reduce((result, object) => {
        if (!object) return result;

        for (const [key, value] of Object.entries(object)) {
            if (
                value &&
                typeof value === 'object' &&
                !Array.isArray(value) &&
                result[key] &&
                typeof result[key] === 'object' &&
                !Array.isArray(result[key])
            ) {
                result[key] = mergeObjects(result[key], value);
            } else {
                result[key] = clone(value);
            }
        }

        return result;
    }, {});
}

function orderPalletTypes(agencyPackage, palletTypes) {
    if (!agencyPackage.palletTypes?.length) return palletTypes;

    const unusedPalletTypes = new Set(palletTypes);

    return agencyPackage.palletTypes.map(packagePallet => {
        const expectedConstraints = packagePallet.constraints ?? {
            maxWeight: packagePallet.maxWeight,
            maxLength: packagePallet.maxLength,
            maxWidth: packagePallet.maxWidth,
            maxHeight: packagePallet.maxHeight
        };
        const palletType = [...unusedPalletTypes].find(candidate =>
            candidate.name === packagePallet.name &&
            Object.entries(expectedConstraints).every(([key, value]) =>
                candidate.constraints?.[key] === value
            )
        );

        if (!palletType) {
            throw new Error(
                `Pallet type "${ packagePallet.name }" not found for ${ agencyPackage.code }`
            );
        }

        unusedPalletTypes.delete(palletType);
        return palletType;
    });
}

export function resolveAgencyRates(agencyPackage, palletTypes) {
    const { defaults = {}, rates = [] } = agencyPackage;
    const orderedPalletTypes = orderPalletTypes(agencyPackage, palletTypes);
    const rateEntries = Array.isArray(rates)
        ? rates
        : Object.entries(rates).map(([zoneName, service]) => ({
            zoneName,
            services: [service]
        }));

    return rateEntries.map(rate => {
        const {
            zoneName,
            palletTypeIndex,
            palletType,
            overrides,
            services = [],
            ...rateOverrides
        } = rate;
        const rateDocument = mergeObjects(defaults.rate, rateOverrides, overrides);

        if (palletTypeIndex !== undefined && palletTypeIndex !== null) {
            const palletType = orderedPalletTypes[palletTypeIndex];

            if (!palletType) {
                throw new Error(
                    `Pallet type index ${ palletTypeIndex } not found for ${ agencyPackage.code }`
                );
            }

            rateDocument.palletTypeId = palletType._id;
        } else if (palletType) {
            const matchingPallet = orderedPalletTypes.find(({ name }) => name === palletType);

            if (!matchingPallet) {
                throw new Error(
                    `Pallet type "${ palletType }" not found for ${ agencyPackage.code }`
                );
            }

            rateDocument.palletTypeId = matchingPallet._id;
        } else {
            rateDocument.palletTypeId = null;
        }

        rateDocument.zoneName = zoneName;
        rateDocument.services = services.map(service =>
            mergeObjects(defaults.service, service)
        );

        return rateDocument;
    });
}

export function resolveAgencyZones(agencyPackage, dynamicData = {}) {
    const zones = dynamicData.zones ?? agencyPackage.zones;

    if (!Array.isArray(zones)) {
        throw new Error(`Zones are not defined for ${ agencyPackage.code }`);
    }

    return {
        zones: zones.map(({ overrides, ...zone }) =>
            mergeObjects(agencyPackage.defaults?.zone, zone, overrides)
        ),
        rules: mergeObjects(agencyPackage.zoneRules, dynamicData.rules)
    };
}
