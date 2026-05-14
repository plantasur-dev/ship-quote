
import { calculateVolumetricWeight } from '../../../../../utils/rateEngine.util.js';

import { dateFormat } from '../../../../../utils/date.util.js'

import CarrierService from '../carriers.service.interface.js';

export default class DascherService extends CarrierService {

    buildRequestBody(input) {
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
                "transportOrderLines": input.items.map(item => {
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
                                "amount": calculateVolumetricWeight(item),
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

    mapResponse(data) {
        return {
            services: [{
                service: data?.id,
                total: data?.totalAmount?.amount,
                breakdown: data?.quotationDetails?.map(r => ({ 
                    type: 'pallet',
                    palletType: r.serviceTypeDescription,
                    quantity: 1,
                    unitPrice: r.serviceTypeAmount.amount
                }))
            }]
        }
    }
};