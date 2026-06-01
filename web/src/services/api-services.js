
import axios from 'axios';

const isTest = import.meta.env.VITE_MODE === 'test';

const baseURL = isTest
  ? import.meta.env.VITE_API_URL_DEV
  : (import.meta.env.VITE_API_URL_PROD || '/api/v1');

const http = axios.create({ baseURL });

http.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const { status, data } = err?.response || {};

        const message = `API Error [${ status }]: ${ data || err.message } `;
        
        console.error(message);

        return Promise.reject(data || { message });
    }
);

export const locationsProvinces = () =>
    http.get('/locations');

export const locationsCountries = () =>
    http.get('/locations/countries');


export const compareRate = (data) => 
    http.post('/rates/compare', data);