
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

        let message = `API Error [${ status ?? err?.name }]: ${ data?.message || err.message } `;

        if (status === 400 ){
            message = `${ data?.message || err.message } `;
        }
        
        console.error(message);

        return Promise.reject( { message } || data );
    }
);

export const listProvinces = () =>
    http.get('/locations/provinces');

export const listCountries = (lang = 'ES') =>
    http.get(`/locations/countries`, { params: { lang } });


export const compareRatesByPostalCode = (data) => 
    http.post('/rates/compareByPostalCode', data);