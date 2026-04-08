
import Agency from "../models/agency.model.js";
import Zone from "../models/zone.model.js";
import Rate from "../models/rate.model.js";
import PalletType from "../models/palletType.model.js";

// ------------------ HELPERS ------------------

function calculateVolume(item) {
    return (item.length * item.width * item.height) / 1000000;
}

function calculateWeightVolume(items) {
    let totalWeight = 0;
    let totalVolume = 0;

    items.forEach(i => {
        totalWeight += i.weight;
        totalVolume += calculateVolume(i);
    });

    return Math.max(totalWeight, totalVolume);
}

function classifyPallet(item, palletTypes) {
    return palletTypes.find(type => {
        const c = type.constraints;

        return (
            (!c.maxWeight || item.weight <= c.maxWeight) &&
            (!c.maxHeight || item.height <= c.maxHeight)
        );
    });
}

function groupPallets(items, palletTypes) {
    const groups = {};

    items.forEach(item => {
        const type = classifyPallet(item, palletTypes);
        if (!type) return;

        if (!groups[type._id]) {
        groups[type._id] = {
            palletType: type,
            quantity: 0
        };
        }

        groups[type._id].quantity += 1;
    });

    return Object.values(groups);
}

function matchPrice(breaks, value) {
    return breaks.find(b => value >= b.min && value <= b.max);
}

// ------------------ ZONE ------------------

function resolveZone(zones, postalCode, province) {
    // 1. excepciones
    for (const z of zones) {
        for (const ex of z.postalCodeExceptions || []) {
            if (postalCode >= ex.from && postalCode <= ex.to) {
                return zones.find(z2 => z2.name === ex.zoneName);
            }
        }
    }

    // 2. por provincia
    return zones.find(z => z.provinces.includes(province));
}

// ------------------ MAIN ENGINE ------------------

export async function compareRates({ destinationPostalCode, province, items }) {

    const agencies = await Agency.find({ active: { $ne: false } });

    const agencyIds = agencies.map(a => a.id);

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
            if (agency.rules.supportsPallets) {
                const palletItems = items.filter(i => i.type === "pallet");

                if (zone.calculationMode === "weight_volume") {
                    const value = calculateWeightVolume(palletItems);

                    const rate = agencyRates.filter(agencyRate =>
                        agencyRate.type === "pallet" && agencyRate.zoneName === zone.name
                    );
                
                    if (!rate.length) throw new Error("No rate");

                    const match = matchPrice(rate.priceBreaks, value);
                    if (!match) throw new Error("No break");

                    console.log('Precio despues de obtener las tarifas: ', match)
                    total += match.price;
                    //console.log(total)
                    breakdown.push({
                        type: "pallet",
                        mode: "weight_volume",
                        value,
                        price: match.price
                    });

                } else {
                    const groups = groupPallets(palletItems, agencyPalletTypes);

                    for (const g of groups) {
                        const rate = agencyRates.find(r =>
                            r.type === "pallet" &&
                            r.zoneName === zone.name &&
                            r.palletTypeId?.equals(g.palletType._id)
                        );

                        if (!rate) throw new Error("No rate");

                        const match = matchPrice(rate.priceBreaks, g.quantity);
                        if (!match) throw new Error("No break");

                        total += match.price;

                        breakdown.push({
                            type: "pallet",
                            palletType: g.palletType.name,
                            quantity: g.quantity,
                            price: match.price
                        });
                    }
                }
            }

            // ---------------- PARCELS ----------------
            if (agency.rules.supportsParcels) {
                const parcelItems = items.filter(i => i.type === "parcel");

                if (parcelItems.length) {
                    const totalWeight = parcelItems.reduce((acc, i) => acc + i.weight, 0);

                    const rate = agencyRates.find(r =>
                        r.type === "parcel" && r.zoneName === zone.name
                );

                if (!rate) throw new Error("No parcel rate");

                const match = matchPrice(rate.priceBreaks, totalWeight);
                if (!match) throw new Error("No break");

                total += match.price;

                breakdown.push({
                    type: "parcel",
                    weight: totalWeight,
                    price: match.price
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