import PalletType from '../../models/palletType.model.js';
import { zonesBootstrap } from '../../utils/bootstrap.utils.js';
import { checkExists, loggerMsg } from '../../utils/logger.utils.js';
import {
    resolveAgencyRates,
    resolveAgencyZones
} from '../../data/packages/agency-package.utils.js';

async function initZones(agencyPackage) {
    const { code } = agencyPackage;
    const zoneResult = await checkExists({ code, collection: 'zone' });
    const ruleResult = await checkExists({ code, collection: 'zoneRule' });

    if (!zoneResult || !ruleResult) return;

    const dynamicData = agencyPackage.loadDynamicData
        ? await agencyPackage.loadDynamicData()
        : {};
    const { zones, rules } = resolveAgencyZones(agencyPackage, dynamicData);

    await zonesBootstrap({
        zoneModel: zoneResult.model,
        agency: zoneResult.agency,
        zones,
        zoneRuleModel: ruleResult.model,
        rules
    });

    loggerMsg({
        status: 'success',
        collection: 'zone',
        message: `${ code } zone importadas correctamente`
    });
}

async function initPalletTypes(agencyPackage) {
    const { code, palletTypes } = agencyPackage;
    if (!palletTypes?.length) return;

    const result = await checkExists({ code, collection: 'palletType' });

    if (!result) return;

    const docs = palletTypes.map(({ name, constraints, ...dimensions }) => ({
        agencyId: result.agency._id,
        name,
        constraints: constraints ?? {
            maxWeight: dimensions.maxWeight,
            maxLength: dimensions.maxLength,
            maxWidth: dimensions.maxWidth,
            maxHeight: dimensions.maxHeight
        }
    }));

    await result.model.insertMany(docs);

    loggerMsg({
        status: 'success',
        collection: 'palletType',
        message: `${ code } palletType importados correctamente`
    });
}

async function initRates(agencyPackage) {
    const { code } = agencyPackage;
    const result = await checkExists({ code, collection: 'rate' });

    if (!result) return;

    const palletTypes = await PalletType.find({ agencyId: result.agency._id });
    const rates = resolveAgencyRates(agencyPackage, palletTypes);

    if (rates.length) {
        await result.model.insertMany(rates.map(rate => ({
            ...rate,
            agencyId: result.agency._id
        })));
    }

    loggerMsg({
        status: 'success',
        collection: 'rate',
        message: `${ code } rate importadas correctamente`
    });
}

export default async function initAgencyData(agencyPackage) {
    if (agencyPackage.schemaVersion !== 1) {
        throw new Error(`Unsupported agency package version for ${ agencyPackage.code }`);
    }

    await initZones(agencyPackage);
    await initPalletTypes(agencyPackage);
    await initRates(agencyPackage);
}
