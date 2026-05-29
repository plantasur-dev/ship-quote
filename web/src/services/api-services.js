
import axios from 'axios';

const baseURL = import.meta.env.REACT_ENV !== 'test' 
    ? import.meta.env.VITE_API_URL || '/api/v1'
    : 'http://localhost:3000/api/v1'
    
const http = axios.create({ baseURL });

http.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const { status, data } = err?.response || {};
        
        console.error(`API Error [${ status }]: `, data || err.message);

        return Promise.reject(data || 
            { message: `API Error [${ status }]: ${ data || err.message } ` });
    }
);

export const locationsProvinces = () =>
    http.get('/locations');

export const locationsCountries = () =>
    http.get('/locations/countries');


export const compareRate = (data) => 
    http.post('/rates/compare', data);