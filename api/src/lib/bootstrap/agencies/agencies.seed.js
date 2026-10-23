
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateAgencyPackage } from '../../../api/services/integrator/validator.package.js';
import { defaultDependencies } from '../../../api/services/integrator/dependence.package.js';

import { hashPackage } from '../../utils/hash.utils.js';
import { logResult, SEED_STATUS } from '../../utils/seed.utils.js';


const PATH_PACKAGES = fileURLToPath(new URL('../../data/rate.packages/', import.meta.url));

const STAT_KEYS = ['palletTypes', 'zones', 'zoneRules', 'rates'];

const sameStats = (a, b) =>
    Boolean(a && b) && STAT_KEYS.every(key => (a[key] ?? 0) === (b[key] ?? 0));

async function seedAgency({ file, content }, { deps, force }) {
    let pkg;

    try {
        pkg = validateAgencyPackage(JSON.parse(content));
    } catch (error) {
        return { 
            file, 
            code: path.basename(file, '.json'), 
            status: SEED_STATUS.FAILED, 
            message: `Paquete ilegible: ${ error.message }`, errors: [], warnings: [] 
        };
    }

    const code = pkg.agency?.code;
    const hash = hashPackage(pkg);

    try {
        const stored = await deps.findAgency(code);

        const base = { file, code, hash };

        if (stored && !force) {
            const state = await deps.getSyncState(code);

            if (state?.packageHash === hash && sameStats(state.stats, await deps.countAgencyData(stored))) {
                return { ...base, status: SEED_STATUS.UNCHANGED, message: 'sin cambios' };
            }
        }

        const agency = stored ?? await deps.createAgency(pkg.agency);

        if (!stored && agency.code !== code) {
            throw new Error(`El nombre de la agencia genera el código "${ agency.code }" y el paquete declara "${ code }"`);
        }

        const counts = await deps.applyPackage({ pkg, agency });

        await deps.saveSyncState(code, {
            agencyCode: code,
            packageHash: hash,
            trigger: 'seed',
            source: { file, ...pkg.source },
            stats: counts,
            appliedAt: new Date()
        });

         return { ...base, status: SEED_STATUS.APPLIED, agencyCreated: !stored, counts, message: 'cargado' };
    } catch (error) {
        return {
            file, code, hash, errors: [], warnings: [],
            status: SEED_STATUS.FAILED,
            message: error.restoreError
                ? `${ error.message } (y no se pudo restaurar el estado anterior: ${ error.restoreError.message })`
                : error.message
        };
    }
}

async function seedPackages({
    dir = PATH_PACKAGES,
    force = false,
    deps = {},
    log = true
} = {}) {
    const dependencies = { ...defaultDependencies, ...deps };

    let files = await dependencies.readPackageFiles(dir);

    if (!files.length) {
        const result = {
            status: SEED_STATUS.FAILED,
            code: 'Packages data', 
            message: `Package folder empty`,
            errors: [],
            warnings: []
        };
        if(log) logResult(result);

        return [result];
    }

    const results = [];

    for (const file of files) {
        const result = await seedAgency(file, { deps: dependencies, force });
        if (log) logResult(result);
        results.push(result);
    }

    return results;
}
 
async function initAgencies(options) {
    const results = await seedPackages(options);

    const failed = results.filter(result => result.status === SEED_STATUS.FAILED);

    if (failed.length) {
        console.error(
            `No se pudieron cargar los paquetes de tarifas: ${ failed.map(result => `${ result.code } (${ result.message })`).join('; ') }`
        );
    }

    return results;
}

export default initAgencies;