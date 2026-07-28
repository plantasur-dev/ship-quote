
import createHttpError from "http-errors";

import { SHIPMENT_UNITS } from '../../../../../../lib/constants/index.js';

export default class CarrierService {
    
    constructor(agency) {
        if (new.target === CarrierService) {
            throw new Error("CarrierService is abstract and cannot be instantiated directly");
        }

        this.agency = agency;
        this.apiConfig = agency.apiConfig;
    }

    async fetchApi (url, options = {}, data = {}, timeout = 5000) {
    
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);

        try {
            const method = options.method?.toUpperCase() || "GET";

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                body: ["GET", "HEAD"].includes(method)
                    ? undefined
                    : JSON.stringify(data)
            });

            const text = await response.text();
            
            let responseData;

            try {
                responseData = JSON.parse(text);    
            } catch (error) {
                responseData = text;
            }
            
            if (!response.ok) {
                let message = responseData?.message ||
                    response.statusText ||
                    "Request failed";
                            
                if (responseData?.details?.length) {
                    for (const msg of responseData?.details) {
                        message += ` ${ msg }`;
                    }    
                }

                throw createHttpError(
                    response.status || 400,
                    message
                );
            }

            return responseData;    
        } catch (error) {
            if (error.name === "AbortError") {
                throw createHttpError(
                    408,
                    `Request timeout after ${ timeout }ms`
                );
            }

            if (error.status) {
                throw createHttpError(error.status, error?.message ?? '');
            }

            throw createHttpError(500, error);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    buildRequestBody(input) {
        throw new Error("buildPayload() not Implemented");
    }

    buildRequestHeaders(apiKey) {
        throw new Error("buildConfig() not Implemented");
    }

    mapResponse(data) {
        throw new Error("normalizeResponse() not Implemented");
    }

    async getRates(input) {        
        const { baseUrlApi, endpoints, apiKey, timeout } = this.apiConfig;
        
        const { quotations } = endpoints;

        let items = [];
        let itemsParcel = [];
        let itemsPallet = [];

        if (!baseUrlApi)
            throw createHttpError(400, "Empty baseUrlAPI");

        if (!quotations) 
            throw createHttpError(400, "Empty endpoint quotations");

        const { supportsPallets, supportsParcels } = this.agency?.rules;

        if (supportsPallets) {
            itemsPallet = input.items.filter(item => 
                item.typeServices === SHIPMENT_UNITS.PALLET
            );
        }

        if (supportsParcels) {
            itemsParcel = input.items.filter(item => 
                item.typeServices === SHIPMENT_UNITS.PARCEL
            );
        }

        items = [...itemsPallet, ...itemsParcel];

        if (!items.length) return [];
        
        const response = await this.fetchApi(
            `${ baseUrlApi }/${ quotations.trim() }`, 
            this.buildRequestHeaders(apiKey), 
            this.buildRequestBody(input, items), 
            timeout
        );

        return this.mapResponse(response, items);
    }
}