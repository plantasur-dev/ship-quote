
import { fileURLToPath } from 'node:url';

import { buildAgencyDocuments, countDocuments } from '../../../../src/api/services/integrator/apply.package.js';
import { defaultDependencies } from '../../../../src/api/services/integrator/dependence.package.js';
import { SEED_STATUS } from '../../../../src/lib/utils/seed.utils.js';
import initAgencies from '../../../../src/lib/bootstrap/agencies/agencies.seed.js';

const packagesDirectory = fileURLToPath(
    new URL('../../../../src/lib/data/rate.packages/', import.meta.url)
);

const mocks = vi.hoisted(() => ({
    state: {
        agencies: new Map(),
        syncStates: new Map(),
        documents: new Map()
    },
    applyPackage: vi.fn(),
    createAgency: vi.fn()
}));

function createDependencies() {
    return {
        readPackageFiles: defaultDependencies.readPackageFiles,
        findAgency: async code => mocks.state.agencies.get(code) ?? null,
        createAgency: mocks.createAgency,
        updateAgencyVolumetric: async (agencyId, volumetric) => {
            const agency = [...mocks.state.agencies.values()]
                .find(item => item._id === agencyId);
            agency.volumetric = volumetric;
            return agency;
        },
        getSyncState: async code => mocks.state.syncStates.get(code) ?? null,
        saveSyncState: async (code, state) => {
            mocks.state.syncStates.set(code, state);
        },
        countAgencyData: async agency => countDocuments(
            mocks.state.documents.get(agency._id) ?? {
                palletTypes: [],
                zones: [],
                zoneRules: [],
                rates: []
            }
        ),
        applyPackage: mocks.applyPackage
    };
}

describe('canonical agency package initialization', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.state.agencies = new Map();
        mocks.state.syncStates = new Map();
        mocks.state.documents = new Map();

        mocks.state.agencies.set('cayco', {
            _id: 'agency-cayco',
            code: 'cayco',
            name: 'Cayco',
            active: false,
            supplements: { fuelSurcharge: { enabled: true, value: 77 } }
        });

        mocks.createAgency.mockImplementation(async definition => {
            const agency = {
                ...definition,
                _id: `agency-${definition.code}`
            };
            mocks.state.agencies.set(agency.code, agency);
            return agency;
        });

        mocks.applyPackage.mockImplementation(async ({ pkg, agency }) => {
            const documents = buildAgencyDocuments(pkg, agency._id);
            mocks.state.documents.set(agency._id, documents);
            return countDocuments(documents);
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('loads each package, preserves existing settings, maps linked data, and skips unchanged packages', async () => {
        const dependencies = createDependencies();
        const firstLoad = await initAgencies({
            dir: packagesDirectory,
            deps: dependencies,
            log: false
        });

        expect(firstLoad).toHaveLength(6);
        expect(firstLoad.every(result => result.status === SEED_STATUS.APPLIED)).toBe(true);
        expect(mocks.state.agencies.size).toBe(6);
        expect(mocks.state.agencies.get('cayco')).toMatchObject({
            active: false,
            supplements: { fuelSurcharge: { enabled: true, value: 77 } }
        });
        expect(mocks.state.agencies.get('dachser')).toMatchObject({
            name: 'Dachser',
            active: false
        });
        expect(firstLoad.reduce((total, result) => total + result.counts.zones, 0)).toBe(553);
        expect(firstLoad.reduce((total, result) => total + result.counts.palletTypes, 0)).toBe(15);
        expect(firstLoad.reduce((total, result) => total + result.counts.rates, 0)).toBe(733);
        expect([...mocks.state.documents.values()]
            .flatMap(({ zoneRules }) => zoneRules)
            .flatMap(({ postalCodeRanges }) => postalCodeRanges)
        ).toHaveLength(572);

        const tecum = mocks.state.agencies.get('tecum');
        const tecumDocuments = mocks.state.documents.get(tecum._id);
        const miniQuarterPallets = tecumDocuments.palletTypes.filter(
            pallet => pallet.name === 'MINI QUARTER PALLET'
        );
        const miniQuarterRates = tecumDocuments.rates.filter(rate =>
            rate.zoneName === 'ZONA 21' &&
            miniQuarterPallets.some(pallet => pallet._id.equals(rate.palletTypeId))
        );

        expect(miniQuarterPallets).toHaveLength(2);
        expect(miniQuarterPallets[0].constraints).not.toEqual(miniQuarterPallets[1].constraints);
        expect(miniQuarterPallets[0]._id).not.toEqual(miniQuarterPallets[1]._id);
        expect(miniQuarterRates).toHaveLength(2);
        expect(miniQuarterRates[0].services).toEqual(miniQuarterRates[1].services);

        const zoneIds = new Set(tecumDocuments.zones.map(zone => zone._id.toString()));
        expect(tecumDocuments.zoneRules.every(rule => zoneIds.has(rule.zoneId.toString()))).toBe(true);
        expect(tecumDocuments.rates.every(rate => zoneIds.has(rate.zoneId.toString()))).toBe(true);
        expect(tecumDocuments.rates.every(rate => rate.agencyId === tecum._id)).toBe(true);

        expect(mocks.applyPackage).toHaveBeenCalledTimes(6);
        const secondLoad = await initAgencies({
            dir: packagesDirectory,
            deps: dependencies,
            log: false
        });

        expect(secondLoad).toHaveLength(6);
        expect(secondLoad.every(result => result.status === SEED_STATUS.UNCHANGED)).toBe(true);
        expect(mocks.applyPackage).toHaveBeenCalledTimes(6);
        expect(mocks.createAgency).toHaveBeenCalledTimes(5);
    });

    it('returns validation failures and does not create agencies for invalid package data', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const invalidPackage = {
            schemaVersion: 1,
            agency: { code: 'cayco', name: 'Cayco' },
            palletTypes: [],
            zones: [],
            exceptions: [],
            rates: [{ zoneName: 'UNKNOWN ZONE', type: 'pallet', services: [] }]
        };
        const dependencies = {
            ...createDependencies(),
            readPackageFiles: async () => [{
                file: 'cayco.json',
                content: JSON.stringify(invalidPackage)
            }]
        };

        const results = await initAgencies({
            dir: packagesDirectory,
            deps: dependencies,
            log: false
        });

        expect(results).toHaveLength(1);
        expect(results[0]).toMatchObject({
            code: 'cayco',
            status: SEED_STATUS.FAILED,
            message: 'Paquete ilegible: Rate references unknown zone "UNKNOWN ZONE" for cayco'
        });
        expect(consoleError).toHaveBeenCalledWith(
            expect.stringContaining('cayco (Paquete ilegible: Rate references unknown zone')
        );
        expect(mocks.createAgency).not.toHaveBeenCalled();
        expect(mocks.applyPackage).not.toHaveBeenCalled();
    });

    it('synchronizes an agency volumetric factor from the package without replacing other agency settings', async () => {
        const packageData = {
            schemaVersion: 1,
            agency: {
                code: 'cayco',
                name: 'Cayco',
                volumetric: { enabled: true, factor: 300 }
            },
            palletTypes: [],
            zones: [],
            exceptions: [],
            rates: [],
            source: {}
        };
        const dependencies = {
            ...createDependencies(),
            readPackageFiles: async () => [{
                file: 'cayco.json',
                content: JSON.stringify(packageData)
            }]
        };

        const results = await initAgencies({
            dir: packagesDirectory,
            deps: dependencies,
            log: false
        });

        expect(results[0].status).toBe(SEED_STATUS.APPLIED);
        expect(mocks.state.agencies.get('cayco')).toMatchObject({
            active: false,
            supplements: { fuelSurcharge: { enabled: true, value: 77 } },
            volumetric: { enabled: true, factor: 300 }
        });

        const secondLoad = await initAgencies({
            dir: packagesDirectory,
            deps: dependencies,
            log: false
        });

        expect(secondLoad[0].status).toBe(SEED_STATUS.UNCHANGED);
        expect(mocks.applyPackage).toHaveBeenCalledTimes(1);
    });

    it('returns an explicit failure when the package directory is empty', async () => {
        const results = await initAgencies({
            dir: packagesDirectory,
            deps: {
                ...createDependencies(),
                readPackageFiles: async () => []
            },
            log: false
        });

        expect(results).toEqual([{
            status: SEED_STATUS.FAILED,
            code: 'Packages data',
            message: 'Package folder empty',
            errors: [],
            warnings: []
        }]);
    });
});
