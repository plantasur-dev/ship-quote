
import Zone from "../../../../../lib/models/zone.model.js";
import Rate from "../../../../../lib/models/rate.model.js";
import PalletType from "../../../../../lib/models/palletType.model.js";

import {
    resolveZone, 
    groupByAgency
} from '../../../../utils/rateEngine.util.js'

import {
    calculatePallet
} from './palletRateEngine.calculator.js';

import {
    calculateParcel
} from './parcelRateEngine.calculator.js';

import { 
    buildStaticErrorResult, 
} from '../../domains/buildRateResult.js';

import { presentRate } from "../../presenters/rate.presenter.js";

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
                return buildStaticErrorResult({
                    presentRate,
                    agency: agency.name,
                    code: 'ZONE_NOT_FOUND'
                });
            }
            
            return (zone.calculationMode === 'pallet')
            ? calculatePallet({
                    nameAgency: agency.name,
                    palletItems, 
                    agencyRates, 
                    agencyPalletTypes, 
                    zone,
                    agencySupplements 
                })
            : calculateParcel({
                    nameAgency: agency.name, 
                    parcelItems, 
                    agencyRates, 
                    zone,
                    agencySupplements 
                });
                
        } catch (error) {
            console.log(error)
            return buildStaticErrorResult({
                presentRate,
                agency: agency.name,
                code: 'CALCULATION_ERROR',
                message: error
            });
        }
    });
}