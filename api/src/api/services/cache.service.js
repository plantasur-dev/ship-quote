
import Zone from "../../lib/models/zone.model.js";
import ZoneRules from "../../lib/models/zone.rules.model.js";
import Rate from "../../lib/models/rate.model.js";
import PalletType from "../../lib/models/palletType.model.js";

let agencyTariffs = null;

function buildRateKey({
    type,
    zoneName,
    palletTypeId
}) {
    return [
        type,
        zoneName,
        palletTypeId ?? 'none'
    ].join('|');
}

function buildTariffStore({
    zones,
    zoneRules,
    rates,
    palletTypes
}) {

    const agencies = Object.create(null);

    const getAgencyStore = agencyId => {

        const id = agencyId.toString();

        if (!agencies[id]) {
            agencies[id] = createAgencyStore();
        }

        return agencies[id];
    };

    for (const zone of zones) {

        const agency =
            getAgencyStore(zone.agencyId);

        agency.zonesById.set(
            zone._id.toString(),
            zone
        );

        agency.zonesByName.set(
            zone.name,
            zone
        );
    }

    for (const palletType of palletTypes) {

        const agencyId = palletType.agencyId.toString();

        const agency =
            getAgencyStore(agencyId);

        agency.palletTypesById.set(
            palletType._id.toString(),
            palletType
        );

        agencies[agencyId].sortedPalletTypes.push(palletType);
    }

    for (const agency of Object.values(agencies)) {
        agency.sortedPalletTypes.sort((a, b) => {
            return (
                a.constraints.maxWeight - b.constraints.maxWeight ||
                a.constraints.maxHeight - b.constraints.maxHeight
            );
        });
    }

    for (const rate of rates) {

        const agency =
            getAgencyStore(rate.agencyId);

        agency.ratesByKey.set(
            buildRateKey({
                type: rate.type,
                zoneName: rate.zoneName,
                palletTypeId: rate.palletTypeId?.toString()
            }),
            rate
        );
    }

    for (const rule of zoneRules) {
        
        const agency =
            getAgencyStore(rule.agencyId);

        const province = rule.province;

        if (!agency.zoneRulesByProvince.has(province)) {
            agency.zoneRulesByProvince.set(
                province,
                []
            );
        }

        agency
            .zoneRulesByProvince
            .get(province)
            .push(rule);
     
        if (!agency.zoneRulesByPostal.has(province)) {
            agency.zoneRulesByPostal.set(
                province, 
                new Map()
            );
        }

        const provinceIndex = agency
            .zoneRulesByPostal
            .get(province);
        
        for (const range of rule.postalCodeRanges) {
            const from = parseInt(range.from, 10);
            const to = parseInt(range.to, 10);

            for (let cp = from; cp <= to; cp++) {
                provinceIndex.set(String(cp), rule);
            }
        }
    }

    return agencies;
}

function createAgencyStore() {
    return {
        zonesById: new Map(),
        zonesByName: new Map(),

        palletTypesById: new Map(),
        sortedPalletTypes: [],

        ratesByKey: new Map(),

        zoneRulesByProvince: new Map(),
        zoneRulesByPostal: new Map()
    };
}

export async function loadAgencyTariffs() {
    const [zones, zoneRules, rates, palletTypes] = await Promise.all([
        Zone.find().lean(),
        ZoneRules.find().lean(),
        Rate.find().lean(),
        PalletType.find().lean()
    ]);

    agencyTariffs = buildTariffStore({
        zones,
        zoneRules,
        rates,
        palletTypes
    });

    return agencyTariffs;
}

export function getAgencyTariffs() {
    if (!agencyTariffs) {
        throw new Error("Data store not initialized");
    }

    return agencyTariffs;
}