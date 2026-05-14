
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

        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                body: options.method === "GET" 
                    ? undefined 
                    : JSON.stringify(data)
            });

            const dataRes = await response.json();

            return dataRes;    
        } catch (error) {
            console.error("API Error: ", error);

            throw createHttpError(502, `Carrier API request failed ${ error }`);
        } finally {
            clearTimeout(id);
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
            throw new createHttpError(400, "Empty baseUrlAPI");

        if (!quotations) 
            throw new createHttpError(400, "Empty endpoint quotations");

        const response = await this.fetchApi(
            `${ baseUrlApi }/${ quotations }`, 
            this.buildRequestHeaders(apiKey), 
            this.buildRequestBody(input), 
            timeout
        );

        return this.mapResponse(response);
    }
}