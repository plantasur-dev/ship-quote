
import { 
    getAgencyTariffs 
} from '../../../cache.service.js';

import {
    resolveZone
} from '../../../../../lib/utils/rate.utils.js';

import {
    calculatePallet
} from './pallet.rate.calculator.js';

import {
    calculateParcel
} from './parcel.rate.calculator.js';

import { 
    buildStaticErrorResult, 
} from '../../domains/build.rate.result.js';

import { presentRate } from "../../presenters/rate.presenter.js";

export default async function getStaticRates(agencies, { destinationPostalCode, province, items }) {
    
    const tariffStore = getAgencyTariffs();

    const palletItems = items.filter(item => item.typeServices === "pallet");
    const parcelItems = items.filter(item => item.typeServices === "parcel");

    return agencies.map(agency => {
        try {
            const agencyData =
                tariffStore[agency.id.toString()];
            
            const agencySupplements = agency?.supplements;
            const agencyZones = agencyData.zones || [];
            const agencyZonesRules = agencyData.zoneRules || [];

            const agencyRates = agencyData.ratesByKey || [];
            const agencyPalletTypes = agencyData.sortedPalletTypes || [];
            
            const zone = resolveZone(agencyData, destinationPostalCode, province);
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
            return buildStaticErrorResult({
                presentRate,
                agency: agency.name,
                code: 'CALCULATION_ERROR',
                message: error
            });
        }
    });
}