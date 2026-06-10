
import axios from 'axios';

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

const http = axios.create({ baseURL });

http.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const { status, data } = err?.response || {};

        const message = `API Error [${ status }]: ${ data?.message || err.message } `;
        
        console.error(message);

        return Promise.reject(data || { message });
    }
);

export const locationsProvinces = () =>
    http.get('/locations/provinces');

export const locationsCountries = () =>
    http.get('/locations/countries');


export const compareRate = (data) => 
    http.post('/rates/compare', data);