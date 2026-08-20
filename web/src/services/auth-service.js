
import axios from "axios";

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

        console.error('Api error: ', data || err.message);

        return Promise.reject({
            status,
            message: data?.message || 'Unexpected error'
        });
    }
);

export const signup = (userData) => 
    http.post('/auth/signup', userData);

export const login = (email, password) => 
    http.post('/auth/login', { email, password });

export const logout = () => 
    http.delete('/auth/logout');

export const verify = () => 
    http.get('/auth/verify');