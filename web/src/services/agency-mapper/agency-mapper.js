
import { toNumber, TYPE_AGENCY } from "../../utils";

export const mapAgencyFromApi = ({ data, isEdit = false }) => {

    const isApi = data.type === TYPE_AGENCY.api || data.type === TYPE_AGENCY.hybrid;

    const payload = {
        name: data.name,
        type: data.type,
        active: data.active,

        rules: {
            supportsPallets: data.rules?.supportspallets,
            supportsParcels: data.rules?.supportsparcels,
            hasAndaluciaRule: data.rules?.hasandaluciarule,
            coverage: data.rules?.coverage ?? [],
        },
    };

    if (data.supplements.fuelsurcharge.enabled) {
        payload.supplements = {
            fuelSurcharge: {
                enabled: data.supplements.fuelsurcharge.enabled,
                type: data.supplements.fuelsurcharge.type,
                value: toNumber(data.supplements.fuelsurcharge.value),
            },
        };
    }

    if (isApi) {
        payload.apiConfig = {
            timeout: toNumber(data.apiconfig.timeout, 3000),
            baseUrlApi: data.apiconfig.baseurlapi,
            endpoints: {
                quotations: data.apiconfig.endpoints?.quotations,
                transportOrders: data.apiconfig.endpoints?.transportorders,
            },
            apiKey: data.apiconfig.apikey,
        };
    }

    

    return payload;
};