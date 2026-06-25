
import { 
    getAgencyTariffs 
} from '../../../cache.service.js';

import {
    resolveZone,
    loadDataStaticRate
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

import { 
    presentRate 
} from "../../presenters/rate.presenter.js";

import { 
    SHIPMENT_UNITS 
} from '../../../../../lib/constants/index.js';

export default async function getStaticRates(agencies, { destinationPostalCode, province, items }) {
    
    try {
        const tariffStore = getAgencyTariffs();

        const palletItems = items.filter(item => item.typeServices === SHIPMENT_UNITS.PALLET);
        const parcelItems = items.filter(item => item.typeServices === SHIPMENT_UNITS.PARCEL);

        return agencies.map(agency => {
            try {
                const { 
                    agencyData, 
                    agencySupplements,
                    agencyRates, 
                    agencyPalletTypes
                } = loadDataStaticRate(agency, tariffStore); 
        
                const zone = resolveZone(agencyData, destinationPostalCode, province);

                if (!zone) {
                    return buildStaticErrorResult({
                        presentRate,
                        agency: agency.name,
                        code: 'ZONE_NOT_FOUND'
                    });
                }

                const calculators = {
                    [SHIPMENT_UNITS.PALLET]: () => calculatePallet({
                        nameAgency: agency.name,
                        palletItems, 
                        agencyRates, 
                        agencyPalletTypes, 
                        zone,
                        agencySupplements 
                    }),
                    [SHIPMENT_UNITS.PARCEL]: () => calculateParcel({
                        nameAgency: agency.name, 
                        parcelItems, 
                        agencyRates, 
                        zone,
                        agencySupplements 
                    })
                };

                const calculator = calculators[zone.calculationMode];

                if (!calculator) {
                    return buildStaticErrorResult({
                        presentRate,
                        agency: agency.name,
                        code: 'UNSUPPORTED_CALCULATION_MODE',
                        message: `Unsupported calculation mode: ${ zone.calculationMode }`  
                    });
                }

                return calculator();

            } catch (error) {
                return buildStaticErrorResult({
                    presentRate,
                    agency: agency.name,
                    code: 'CALCULATION_ERROR',
                    message: error
                });
            }
        });
        
    } catch (error) {
        console.log(error);

        throw new Error('Data store not initialized');
    }
}