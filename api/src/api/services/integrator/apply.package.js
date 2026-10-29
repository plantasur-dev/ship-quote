
import mongoose from 'mongoose';

import Zone from '../../../lib/models/zone.model.js';
import ZoneRules from '../../../lib/models/zone.rules.model.js';
import Rate from '../../../lib/models/rate.model.js';
import PalletType from '../../../lib/models/palletType.model.js';

import { expandRates } from './schema.package.js';

import { withSuspendedRefresh } from '../cache.service.js';

import { buildZoneRules } from '../../../lib/utils/bootstrap.utils.js';

const defaultModels = { Zone, ZoneRules, Rate, PalletType };

const newId = () => new mongoose.Types.ObjectId();


export function buildAgencyDocuments(pkg, agencyId) {
    const palletTypes = pkg.palletTypes.map(palletType => ({
        _id: newId(),
        agencyId,
        name: palletType.name,
        constraints: palletType.constraints
    }));

    const idByPalletType = new Map(
        pkg.palletTypes.map((palletType, index) => [palletType, palletTypes[index]._id])
    );

    const zones = pkg.zones.map(zone => ({
        _id: newId(),
        agencyId,
        name: zone.name,
        provinces: zone.provinces,
        calculationMode: zone.calculationMode,
        pricingMode: zone.pricingMode,
        ...(zone.volumetric ? { volumetric: zone.volumetric } : {})
    }));

    const zoneIdByName = new Map(zones.map(zone => [zone.name, zone._id]));

    const zoneRules = buildZoneRules(zones, pkg.exceptions, agencyId);

    const rates = expandRates(pkg).expanded.map(rate => ({
        agencyId,
        zoneId: zoneIdByName.get(rate.zoneName) ?? null,
        type: rate.type,
        zoneName: rate.zoneName,
        palletTypeId: rate.palletTypeRef ? idByPalletType.get(rate.palletTypeRef) : null,
        calculationType: rate.calculationType,
        services: rate.services
    }));

    return { palletTypes, zones, zoneRules, rates };
}

export const countDocuments = documents => ({
    palletTypes: documents.palletTypes.length,
    zones: documents.zones.length,
    zoneRules: documents.zoneRules.length,
    rates: documents.rates.length
});

const COLLECTIONS = [
    ['palletTypes', 'PalletType'],
    ['zones', 'Zone'],
    ['zoneRules', 'ZoneRules'],
    ['rates', 'Rate']
];

async function snapshot(models, agencyId) {
    const result = {};

    for (const [key, modelName] of COLLECTIONS) {
        result[key] = await models[modelName].find({ agencyId }).lean();
    }

    return result;
}

async function clear(models, agencyId) {
    for (const [, modelName] of COLLECTIONS) {
        await models[modelName].deleteMany({ agencyId });
    }
}

async function insert(models, documents) {
    for (const [key, modelName] of COLLECTIONS) {
        if (documents[key].length) {
            await models[modelName].insertMany(documents[key]);
        }
    }
}

export async function applyPackage({
    pkg,
    agency,
    models = defaultModels,
    suspendRefresh = withSuspendedRefresh
}) {
    const documents = buildAgencyDocuments(pkg, agency._id);

    return suspendRefresh(async () => {
        const previous = await snapshot(models, agency._id);

        try {
            await clear(models, agency._id);
            await insert(models, documents);
        } catch (error) {
            try {
                await clear(models, agency._id);
                await insert(models, previous);
            } catch (restoreError) {
                error.restoreError = restoreError;
            }

            throw error;
        }

        return countDocuments(documents);
    });
}