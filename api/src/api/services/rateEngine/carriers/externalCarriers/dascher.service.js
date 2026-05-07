
import { calculateVolumetricWeight } from '../../../../utils/rateEngine.util.js';

import { dateFormat } from '../../../../utils/date.util.js'

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
                        "id": "<consignor id>"
                    },
                "consignee": {
                    "addressInformation": {
                        "postalCode": input.destinationPostalCode,
                        "countryCode": "ES"
                    }
                },
                "transportOptions": {
                    "deliveryTailLift": true,
                    "selfCollector": true,
                    "frostProtected": true,
                    "storageSpace": 10
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
                            "length": item.length,
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
                "X-API-Key": apiKey,
            },
        }
    }

    mapResponse(data) {
        return {
            available: true,
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