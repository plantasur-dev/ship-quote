
import fs from 'node:fs/promises';
import path from 'node:path';

import Agency from '../../../lib/models/agency.model.js';
import Rate from '../../../lib/models/rate.model.js';
import PalletType from '../../../lib/models/palletType.model.js';
import Zone from '../../../lib/models/zone.model.js';
import ZoneRules from '../../../lib/models/zone.rules.model.js';
import PackageSync from '../../../lib/models/package.sync.model.js'; 

import { applyPackage } from './apply.package.js';


export const defaultDependencies = {
    readPackageFiles: async dir => {
        const names = (await fs.readdir(dir)).filter(name => name.endsWith('.json')).sort();

        return Promise.all(names.map(async name => ({
            file: name,
            content: await fs.readFile(path.join(dir, name), 'utf8')
        })));
    },

    findAgency: code => Agency.findOne({ code }).lean(),

    createAgency: ({ code, ...definition }) => Agency.create(definition),

    updateAgencyVolumetric: (agencyId, volumetric) =>
        Agency.findByIdAndUpdate(
            agencyId,
            { $set: { volumetric } },
            { returnDocument: 'after', runValidators: true }
        ).lean(),

    getSyncState: agencyCode => PackageSync.findOne({ agencyCode }).lean(),

    saveSyncState: (agencyCode, data) =>
        PackageSync.findOneAndUpdate({ agencyCode }, data, { upsert: true, returnDocument: 'after' }),

    countAgencyData: async agency => {
        const [palletTypes, zones, zoneRules, rates] = await Promise.all([
            PalletType.countDocuments({ agencyId: agency._id }),
            Zone.countDocuments({ agencyId: agency._id }),
            ZoneRules.countDocuments({ agencyId: agency._id }),
            Rate.countDocuments({ agencyId: agency._id })
        ]);

        return { palletTypes, zones, zoneRules, rates };
    },

    applyPackage
};