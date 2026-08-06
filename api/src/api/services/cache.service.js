
import Zone from "../../lib/models/zone.model.js";
import ZoneRules from "../../lib/models/zone.rules.model.js";
import Rate from "../../lib/models/rate.model.js";
import PalletType from "../../lib/models/palletType.model.js";

let agencyTariffs = null;

function buildRateKey({ type, zoneName, palletTypeId }) {
    return [
        type,
        zoneName,
        palletTypeId ?? 'none'
    ].join('|');
}

function createAgencyStore() {
    return {
        zonesById: new Map(),
        zonesByName: new Map(),

        palletTypesById: new Map(),
        sortedPalletTypes: [],

        ratesByKey: new Map(),

        zoneRulesByProvince: new Map(),
        zoneRangePostalByPostalCode: new Map(),
        zoneExceptionsByPostalCode: new Map()
    };
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
     
        if (rule.postalCodeRanges.length === 0)  continue;

        for (const range of rule.postalCodeRanges) {
            switch (range.kind) {
                case 'prefix': {
                    if (!agency.zoneRangePostalByPostalCode.has(province)) {
                        agency.zoneRangePostalByPostalCode.set(
                            province, 
                            new Map()
                        );
                    }

                    const prefixMap = agency
                        .zoneRangePostalByPostalCode
                        .get(province);

                    prefixMap.set(range.from.slice(0, 2), rule);
                    break;
                }
                    
                case 'exception': {
                    if (!agency.zoneExceptionsByPostalCode.has(province)) {
                        agency.zoneExceptionsByPostalCode.set(
                            province, 
                            new Map()
                        );
                    }

                    const exceptionsMap = agency
                        .zoneExceptionsByPostalCode
                        .get(province);

                    if (range.from === range.to) {
                        exceptionsMap.set(range.from, rule);
                    } else {
                        const size = parseInt(range.to, 10) - parseInt(range.from, 10);
                        if (size > 2500) {
                            throw new Error(
                                `Rango ${ range.from }-${ range.to } de ${ rule.agencyId } / ${ province } demasiado grande para expandir (${ size } códigos)`
                            );
                        }
                        
                        const from = parseInt(range.from, 10);
                        const to = parseInt(range.to, 10);

                        const len = range.from.length;
            
                        for (let cp = from; cp <= to; cp++) {
                            exceptionsMap.set(
                                String(cp).padStart(len, '0'), 
                                rule
                            );
                        }
                    }
                    break;
                }
                default:
                    throw new Error(`kind desconocido: ${ range.kind }`); 
                    break;
            }
        }
    }

    return agencies;
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

export async function invalidateAgencyTariffs() {
    await loadAgencyTariffs().
        catch (error => console.error('Error refrescando caché', error));
}