
import { 
    getAgencyTariffs 
} from '../../../cache.service.js';

import {
    loadDataStaticRate
} from '../../../../../lib/utils/rate.utils.js';

import {
    resolveZone
} from '../../domains/zone/zone.rules.js';

import {
    filterEligibleAgencies
} from '../../domains/agency/agency.eligibility.js';

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
    presentAgencyRate
} from '../../presenters/rate.presenter.js';

import { 
    SHIPMENT_UNITS 
} from '../../../../../lib/constants/index.js';

export default async function getStaticRates(agencies, { destinationPostalCode, province, items, zone: defaultZoneLabel }) {
    
    try {
        const tariffStore = getAgencyTariffs();

        const availableAgencies = filterEligibleAgencies(agencies, items);

        return availableAgencies.map(agency => {
            const rateComplete = calculateAgencyStaticRate({
                agency,
                tariffStore,
                destinationPostalCode,
                province,
                items,
                defaultZoneLabel
            });

            return presentAgencyRate(rateComplete);
        });
        
    } catch (error) {
        console.error(error.message);

        throw new Error(`Data store not initialized ${ error.message }`);
    }
}

function calculateAgencyStaticRate({ agency, tariffStore, destinationPostalCode, province, items, defaultZoneLabel }) {
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
                agency: agency.name,
                zone: defaultZoneLabel,
                code: 'ZONE_NOT_FOUND'
            });
        }

        const palletItems = items.filter(item => item.typeServices === SHIPMENT_UNITS.PALLET);
        const parcelItems = items.filter(item => item.typeServices === SHIPMENT_UNITS.PARCEL);

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
                agency: agency.name,
                zone: zone.name,
                code: 'UNSUPPORTED_CALCULATION_MODE',
                message: `Unsupported calculation mode: ${ zone.calculationMode }`
            });
        }

        return calculator();

    } catch (error) {
        console.error(error.message);

        return buildStaticErrorResult({
            agency: agency.name,
            zone: defaultZoneLabel,
            code: 'CALCULATION_ERROR',
            message: error.message
        });
    }
}