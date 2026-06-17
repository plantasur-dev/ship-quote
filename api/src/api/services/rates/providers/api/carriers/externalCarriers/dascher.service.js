
import { calculateVolumeM3 } from '../../../../../../../lib/utils/rate.utils.js';

import { dateFormat } from '../../../../../../../lib/utils/date.utils.js';

import { transportProducts } from '../../../../../../../lib/constants/dascher.products.js';

import CarrierService from '../carriers.service.interface.js';

import { 
    buildRateResult, 
    buildConcept,
    buildIncident
} from '../../../../domains/build.rate.result.js';

export default class DascherService extends CarrierService {

    async getRates(input) {
        const { baseUrlApi, endpoints, apiKey, timeout } = this.apiConfig;

        const items = input.items.filter(
            item => this.agency.rules.supportsPallets &&
            item.typeServices === "pallet"
        );

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

        const validResponses = responses
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);

        return validResponses.flatMap(response => 
            this.mapResponse(response, items)
        );
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
                        "countryCode": "ES"
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

        const { response, product } = data;
        
        const { name, rules } = this.agency;

        const typePallet = 
            rules.supportsPallets 
                ? 'pallet' 
                : 'parcel';
        
        if (response?.totalAmount.amount === 0) {
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
        
        return [
            buildRateResult({
                service: `${product?.name} (${ response?.id })` || name,
                transportType: typePallet,
                itemCount: items.length || 0,
                concepts: [ 
                    ...response?.quotationDetails?.map(r => (
                        buildConcept(
                                r.serviceTypeDescription,
                                r.serviceTypeAmount?.amount
                            )    
                        ) || []
                    )
                ],
                incidents: []
            })
        ];
    }
};