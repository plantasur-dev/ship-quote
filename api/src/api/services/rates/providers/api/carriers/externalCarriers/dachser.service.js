
import { calculateVolumeM3 } from '../../../../../../../lib/utils/rate.utils.js';

import { dateFormat } from '../../../../../../../lib/utils/date.utils.js';

import { transportProducts } from '../../../../../../../lib/constants/dachser.products.js';

import { isAgencyEligibleFor } from '../../../../domains/agency/agency.eligibility.js';

import CarrierService from '../carriers.service.interface.js';

import { 
    SHIPMENT_UNITS 
} from '../../../../../../../lib/constants/shipment.units.js';

import { 
    buildRateResult, 
    buildConcept,
    buildIncident
} from '../../../../domains/build.rate.result.js';

export default class DachserService extends CarrierService {

    async getRates(input) {
        const { baseUrlApi, endpoints, apiKey, timeout } = this.apiConfig;

        if (!isAgencyEligibleFor(this.agency, new Set([SHIPMENT_UNITS.PALLET]))) {
            return [];
        }

        const items = input.items.filter(
            item => item.typeServices === SHIPMENT_UNITS.PALLET
        );
        
        if (items.length === 0) return [];

        const { quotations } = endpoints;

        const responses = await Promise.allSettled(
            transportProducts.map(async product => ({
                'response': await this.fetchApi(
                    `${ baseUrlApi }/${ quotations.trim() }`,
                    this.buildRequestHeaders(apiKey),
                    this.buildRequestBody(input, items, product.code),
                    timeout
                ),
                product
            }))
        );

        return responses.flatMap(response => {
            if (response.status === 'fulfilled') {
                return this.mapResponse(response.value, items)
            }
            
            return this.mapResponse({ error: response.reason }, items);
        });
    }

    buildRequestBody(input, items = [], product) {
        return {
            "transportOrder": {
                "transportDate": dateFormat(),
                "division": "T",
                "product": product,
                "term": "031",
                "consignor": {
                    "id": process.env.DACHSER_API_N_CUSTOMER
                },
                "consignee": {
                    "addressInformation": {
                        "postalCode": input.destinationPostalCode,
                        "countryCode": input.countryCode
                    }
                },
                "transportOrderLines": items.map(item => {
                    return {
                        "quantity": 1,
                        "packaging": "EU",
                        "weight": {
                            "weight": item.weight,
                            "unit": "KG"
                        },
                        "measure": {
                            "length": item.large,
                            "width": item.width,
                            "height": item.height,
                            "unit": "CM",
                            "volume": {
                                "amount": calculateVolumeM3(item),
                                "unit": "M3"
                            }
                        }
                    }
                })
            }
        }
    };

    buildRequestHeaders(apiKey) {
        return {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "X-API-Key": apiKey.trim(),
            },
        }
    }

    mapResponse(data, items = []) {

        const { response, product, error } = data;

        const { name, rules } = this.agency;

        const typePallet = 
            rules.supportsPallets 
                ? SHIPMENT_UNITS.PALLET 
                : SHIPMENT_UNITS.PARCEL;
        
        if (error) {    
            return [
                buildRateResult({
                    service: 'API_ERROR',
                    transportType: typePallet,
                    itemCount: items.length || 0,
                    concepts: [],
                    incidents: [
                        buildIncident(
                            'API_ERROR',
                            error
                        )
                    ]
                })
            ]
        }
        
        if (response?.totalAmount?.amount === 0) {
            return [
                buildRateResult({
                    service: 'NO_RATE',
                    transportType: typePallet,
                    itemCount: items.length || 0,
                    concepts: [],
                    incidents: [
                        buildIncident(
                            'NO_RATE'
                        )
                    ]
                })
            ]
        }
        
        const service = (product?.name && response?.id) 
            ? `${ product?.name } (${ response?.id })` 
            : name;

        return [
            buildRateResult({
                service,
                transportType: typePallet,
                itemCount: items.length || 0,
                concepts: [ 
                    ...response?.quotationDetails?.map(r => (
                        buildConcept(
                                r.serviceTypeDescription,
                                r.serviceTypeAmount?.amount
                            )    
                        )
                    ) || []
                ],
                incidents: []
            })
        ];
    }
};