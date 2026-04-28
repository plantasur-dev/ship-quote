

import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
});

http.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const { status, data } = err?.response || {};
        
        if (status === 400) {
            console.error('API Error:', data || err.message);
        }

        return Promise.reject(data);
    }
);

export const locationsProvinces = () =>
    http.get('/locations');

export const locationsCountries = () =>
    http.get('/locations/countries');


export const compareRate = (data) => 
    http.post('/rates/compare', data);