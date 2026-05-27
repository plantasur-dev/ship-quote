
import { calculateVolumeM3 } from '../../../../../../../lib/utils/rate.utils.js';

import { dateFormat } from '../../../../../../../lib/utils/date.utils.js';

import CarrierService from '../carriers.service.interface.js';

import { 
    buildRateResult, 
    buildConcept,
    buildIncident
} from '../../../../domains/build.rate.result.js';

export default class DascherService extends CarrierService {

    buildRequestBody(input, items = []) {
        return {
            "transportOrder": {
                "transportDate": dateFormat(),
                "division": "T",
                "product": "Y",
                "term": "031",
                "consignor": {
                    "id": "46333461"
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
                        "loadingMetre": 0.4,
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
        
        const { name, rules } = this.agency;
        
        if (data?.totalAmount.amount === 0) {
            return [
                buildRateResult({
                    service: 'NO_RATE',
                    transportType: rules.supportsPallets ? 'pallet' : 'parcel',
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
                service: data?.id || name,
                transportType: rules.supportsPallets ? 'pallet' : 'parcel',
                itemCount: items.length || 0,
                concepts: [ 
                    ...data?.quotationDetails?.map(r => (
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