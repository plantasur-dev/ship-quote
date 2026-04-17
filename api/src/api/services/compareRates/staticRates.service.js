
import Zone from "../../../lib/models/zone.model.js";
import Rate from "../../../lib/models/rate.model.js";
import PalletType from "../../../lib/models/palletType.model.js";

import { 
    calculateWeightVolume, 
    calculatePallet, 
    resolveZone, 
    groupByAgency 
} from '../../utils/helpers.rateEngine.js';

export async function getStaticRates(agencies, { destinationPostalCode, province, items }) {

    const agencyIds = agencies.map(a => a._id);

    const [zones, rates, palletTypes] = await Promise.all([
        Zone.find({ agencyId: { $in: agencyIds } }),
        Rate.find({ agencyId: { $in: agencyIds } }),
        PalletType.find({ agencyId: { $in: agencyIds } })
    ]);

    const zonesByAgency = groupByAgency(zones);
    const ratesByAgency = groupByAgency(rates);
    const palletTypesByAgency = groupByAgency(palletTypes);

    const palletItems = items.filter(i => i.type === "pallet");

    return agencies.map(agency => {
        try {
            const agencyId = agency.id.toString();

            const agencyZones = zonesByAgency[agencyId] || [];
            const agencyRates = ratesByAgency[agencyId] || [];
            const agencyPalletTypes = palletTypesByAgency[agencyId] || [];
            
            const zone = resolveZone(agencyZones, destinationPostalCode, province);
            if (!zone) {
                return {
                    agency: agency.name,
                    available: false,
                    reason: "Zona no encontrada"
                };
            }

            const services = (zone.calculationMode === "weight_volume") 
                ? calculateWeightVolume({ palletItems, agencyRates, zone })
                : calculatePallet({ palletItems, agencyRates, agencyPalletTypes, zone });

            if (services.length === 0) {
                return {
                    agency: agency.name,
                    available: false,
                    reason: "No hay tarifa disponible"
                };
            }
            
            return {
                agency: agency.name,
                available: true,
                zone: zone.name,
                services
            };

        } catch (error) {
            console.error(error);

            return {
                agency: agency.name,
                available: false,
                reason: "Error en cálculo"
            };
        }
    });
}