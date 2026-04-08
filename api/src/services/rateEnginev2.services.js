
import Agency from "../models/agency.model.js";
import Zone from "../models/zone.model.js";
import Rate from "../models/rate.model.js";
import PalletType from "../models/palletType.model.js";
import { getEffectiveWeight, groupPallets, resolveZone, findRate, matchPrice} from '../utils/helpers.rateEngine.js';

export async function compareRatesV2({ destinationPostalCode, province, items }) {

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

            let total = 0;
            const breakdown = [];

            // ---------------- PALLETS ----------------
            const palletItems = items.filter(i => i.type === "pallet");

            // ANDALUCÍA
            if (zone.calculationMode === "weight_volume") {

                console.log('ANDALUCÍA');

                let totalWeight = 0;

                palletItems.forEach(item => {
                    totalWeight += getEffectiveWeight(item);
                });

                const rate = findRate(agencyRates, {
                    zoneName: zone.name,
                    type: "pallet"
                });

                if (!rate) throw new Error("No rate Andalucía");

                console.log('Andalucia Rate: ', rate.priceBreaks)

                const match = matchPrice(rate.priceBreaks, totalWeight);
                if (!match) throw new Error("No tramo Andalucía");

                total += match.price;

                breakdown.push({
                    type: "pallet",
                    mode: "weight_volume",
                    totalWeight,
                    price: match.price
                });

            } else {
                // (NACIONAL)
                console.log('NACIONAL');

                const groups = groupPallets(palletItems, agencyPalletTypes);

                for (const g of groups) {
                    const rate = findRate(agencyRates, {
                        zoneName: zone.name,
                        palletTypeId: g.palletType._id,
                        type: "pallet"
                    });

                    if (!rate) throw new Error("No rate pallet");

                    let price = 0;

                    // CASO 1: tarifa por cantidad (COMPLETO / SUPER)
                    if (rate.priceBreaks.length > 1) {
                        const match = matchPrice(rate.priceBreaks, g.quantity);
                        if (!match) throw new Error("No tramo cantidad");

                        price = match.price * g.quantity;
                    }

                    // CASO 2: tarifa fija por pallet
                    else {
                        price = rate.priceBreaks[0].price * g.quantity;
                    }

                    total += Math.round(price, 2);

                    breakdown.push({
                        type: "pallet",
                        palletType: g.palletType.name,
                        quantity: g.quantity,
                        price
                    });
                }
            }

            results.push({
                agency: agency.name,
                available: true,
                total,
                breakdown
            });

        } catch (err) {
            results.push({
                agency: agency.name,
                available: false,
                reason: "No hay tarifa disponible"
            });
        }
    }

  return results;
}