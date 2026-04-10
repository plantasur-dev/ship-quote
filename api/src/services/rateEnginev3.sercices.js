
import Agency from "../models/agency.model.js";
import Zone from "../models/zone.model.js";
import Rate from "../models/rate.model.js";
import PalletType from "../models/palletType.model.js";
import { getEffectiveWeight, groupPallets, resolveZone, matchPrice } from '../utils/helpers.rateEngine.js';

export async function compareRatesV3({ destinationPostalCode, province, items }) {

    const agencies = await Agency.find({ active: { $ne: false } });
    const agencyIds = agencies.map(a => a._id);

    const [zones, rates, palletTypes] = await Promise.all([
        Zone.find({ agencyId: { $in: agencyIds } }),
        Rate.find({ agencyId: { $in: agencyIds } }),
        PalletType.find({ agencyId: { $in: agencyIds } })
    ]);

    const results = [];

    for (const agency of agencies) {
        try {
            const agencyZones = zones.filter(z => z.agencyId.equals(agency._id));
            const agencyRates = rates.filter(r => r.agencyId.equals(agency._id));
            const agencyPalletTypes = palletTypes.filter(p => p.agencyId.equals(agency._id));
            
            const zone = resolveZone(agencyZones, destinationPostalCode, province);
            
            if (!zone) {
                results.push({
                    agency: agency.name,
                    available: false,
                    reason: "Zona no encontrada"
                });
                continue;
            }

            const palletItems = items.filter(i => i.type === "pallet");

            const serviceTotals = {};
            const serviceBreakdowns = {};

            // ---------------- ANDALUCÍA ----------------
            if (zone.calculationMode === "weight_volume") {

                let totalWeight = 0;

                for (const item of palletItems) {
                   totalWeight += getEffectiveWeight(item);
                }

                const rate = agencyRates.find(r =>
                    r.zoneName === zone.name &&
                    r.type === "pallet"
                );

                if (!rate) throw new Error("No rate Andalucía");

                for (const service of rate.services) {

                    const match = matchPrice(service.priceBreaks, totalWeight);
                    if (!match) continue;

                    if (!serviceTotals[service.service]) {
                        serviceTotals[service.service] = 0;
                        serviceBreakdowns[service.service] = [];
                    }

                    serviceTotals[service.service] += match.price;

                    serviceBreakdowns[service.service].push({
                        type: "weight_volume",
                        totalWeight,
                        price: match.price
                    });
                }

            } else {

            // ---------------- NACIONAL ----------------
                const groups = groupPallets(palletItems, agencyPalletTypes);
                
                for (const g of groups) {

                    const rate = agencyRates.find(r =>
                        r.zoneName === zone.name &&
                        r.palletTypeId?.equals(g.palletType._id)
                    );
                    
                    if (!rate) continue;
                    
                    for (const service of rate.services) {

                        const match = matchPrice(service.priceBreaks, g.quantity);
                        if (!match || !match.price) continue;

                        if (!serviceTotals[service.service]) {
                            serviceTotals[service.service] = 0;
                            serviceBreakdowns[service.service] = [];
                        }

                        let totalPrice = 0;

                        if (rate.calculationType === "quantity") {
                            totalPrice = match.price * g.quantity;
                        } else {
                            totalPrice = match.price;
                        }

                        serviceTotals[service.service] += Math.round(totalPrice, 2);

                        serviceBreakdowns[service.service].push({
                            type: "pallet",
                            palletType: g.palletType.name,
                            quantity: g.quantity,
                            unitPrice: match.price,
                            total: totalPrice
                        });
                    }
                }
            }

            const services = Object.keys(serviceTotals).map(service => ({
                service,
                total: serviceTotals[service],
                breakdown: serviceBreakdowns[service]
            }));

            if (services.length === 0) {
                results.push({
                    agency: agency.name,
                    available: false,
                    reason: "No hay tarifa disponible"
                });
                continue;
            }
            
            results.push({
                agency: agency.name,
                available: true,
                zone: zone.name,
                services
            });

        } catch (err) {
            results.push({
                agency: agency.name,
                available: false,
                reason: "Error en cálculo"
            });
        }
    }

    return results;
}