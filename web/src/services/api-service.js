
import axios from 'axios';

import { toNumber  } from '../utils';

const config = {
    isTest: import.meta.env.VITE_NODE_ENV === 'test',
    api_url_dev: import.meta.env.VITE_API_URL_DEV,
    api_url_pro: import.meta.env.VITE_API_URL_PROD
};

const baseURL = config.isTest 
    ? config.api_url_dev 
    : config.api_url_pro;

if (!baseURL) {
    throw new Error('No se encontró la URL de la API. Revisa las variables de entorno.');
}

const http = axios.create({ 
    baseURL, 
    withCredentials: true 
});

http.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const { status, data } = err?.response || {};

        let message = `API Error [${ status ?? err?.name }]: ${ data?.message || err.message } `;

        if (status === 400 ){
            message = `${ data?.message || err.message } `;
        }
        
        console.error(message);

        return Promise.reject( { message } || data );
    }
);

export const releaseLatest = () =>
    http.get('/releases/latest');


export const listProvinces = () =>
    http.get('/locations/provinces');

export const listCountries = (lang = 'ES') =>
    http.get(`/locations/countries`, { params: { lang } });


export const compareRatesByPostalCode = (data) => 
    http.post('/rates/compareByPostalCode', data);


export const createAgency = (data) => {
    console.log(data)

    const isApi = data.type === 'api' || data.type === 'hybric';

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

    console.log(payload);

    return http.post(`/agencies`, payload);
}
    
export const updateAgency = (agencyId, data) =>
    http.patch(`/agencies/${ agencyId }`, data);

export const listAgencies = () => 
    http.get('/agencies');

export const setActiveAgency = (agencyId) =>
    http.patch(`/agencies/${ agencyId }/active`)

export const updateFuelSurchargeAgency = (agencyId, data) =>
    http.patch(`/agencies/${ agencyId }/supplements/fuel-surcharge`, data);


export const listAudit = (pagination = {}) =>
    http.get('/audits', { params: pagination });