
import axios from 'axios';

import { mapAgencyFromApi } from './agency-mapper/agency-mapper';

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

        console.error(err);
    
        if (status === 400 ){
            return Promise.reject({ type: 'validations', errors: data });
        }
       
        return Promise.reject({ type: 'server', errors: data, status });
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


export const createAgency = (data) => 
    http.post(`/agencies`, mapAgencyFromApi({ data }));

export const getAgency = (agencyId) => 
    http.get(`/agencies/${ agencyId }`);

export const updateAgency = (agencyId, data) =>
    http.patch(`/agencies/${ agencyId }`, mapAgencyFromApi({ isEdit: true , data }));

export const listAgencies = () => 
    http.get('/agencies');

export const setActiveAgency = (agencyId) =>
    http.patch(`/agencies/${ agencyId }/active`)

export const updateFuelSurchargeAgency = (agencyId, data) =>
    http.patch(`/agencies/${ agencyId }/supplements/fuel-surcharge`, data);


export const listAudit = (pagination = {}) =>
    http.get('/audits', { params: pagination });