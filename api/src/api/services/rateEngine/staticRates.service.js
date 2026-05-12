
import Zone from "../../../lib/models/zone.model.js";
import Rate from "../../../lib/models/rate.model.js";
import PalletType from "../../../lib/models/palletType.model.js";

import {
    resolveZone, 
    groupByAgency
} from '../../utils/rateEngine.util.js'

import {
    calculatePallet,
    calculateParcel 
} from './rateEngine.calculator.js';

export default async function getStaticRates(agencies, { destinationPostalCode, province, items }) {
    const agencyIds = agencies.map(agency => agency.id);

    const [zones, rates, palletTypes] = await Promise.all([
        Zone.find({ agencyId: { $in: agencyIds } }),
        Rate.find({ agencyId: { $in: agencyIds } }),
        PalletType.find({ agencyId: { $in: agencyIds } })
    ]);

    const zonesByAgency = groupByAgency(zones);
    const ratesByAgency = groupByAgency(rates);
    const palletTypesByAgency = groupByAgency(palletTypes);

    const palletItems = items.filter(item => item.typeServices === "pallet");
    const parcelItems = items.filter(item => item.typeServices === "parcel");

    return agencies.map(agency => {
        try {
            const agencyId = agency.id.toString();
            
            const agencySupplements = agency?.supplements;
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

            let services = []; 
            
            services = (zone.calculationMode === 'pallet')
                ? calculatePallet({ 
                        palletItems, 
                        agencyRates, 
                        agencyPalletTypes, 
                        zone,
                        agencySupplements 
                    })
                : calculateParcel({ 
                        parcelItems, 
                        agencyRates, 
                        zone,
                        agencySupplements 
                    });
        
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

            return {
                agency: agency.name,
                available: false,
                reason: "Error en cálculo"
            };
        }
    });
}