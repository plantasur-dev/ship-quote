
export default class CarrierService {
    constructor(agency) {
        if (new.target === CarrierService) {
            throw new Error("CarrierService is abstract and cannot be instantiated directly");
        }

        this.agency = agency;
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

            throw error;
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

        const { endpoint, apiKey, timeout } = this.agency.apiConfig;

        const response = await this.fetchApi(
            endpoint, 
            this.buildRequestHeaders(apiKey), 
            this.buildRequestBody(input), 
            timeout
        );

        return this.mapResponse(response);
    }
}