
import createHttpError from "http-errors";
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
            
            let responseData = null;

            try {
                responseData = await response.json();    
            } catch (error) {
                responseData = await response.text();
            }
            
            if (!response.ok) {
                const message =
                responseData?.message ||
                responseData?.details ||
                response.statusText ||
                "Request failed";

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

            throw createHttpError(
                error?.status || 502, 
                error?.message
            );
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

        if (!baseUrlApi)
            throw createHttpError(400, "Empty baseUrlAPI");

        if (!quotations) 
            throw createHttpError(400, "Empty endpoint quotations");

        const { supportsPallets } = this.agency?.rules;

        const items = input?.items
            .filter(item => supportsPallets && item.typeServices === "pallet") 
            || [];
        
        const response = await this.fetchApi(
            `${ baseUrlApi }/${ quotations.trim() }`, 
            this.buildRequestHeaders(apiKey), 
            this.buildRequestBody(input, items), 
            timeout
        );

        return this.mapResponse(response, items);
    }
}