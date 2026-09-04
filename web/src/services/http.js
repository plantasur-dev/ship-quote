
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
        const url = err?.config?.url || '';
        
        const isAuthEndpoint = url.startsWith('/auth/');

        console.error(err);

        if (status === 401 && !isAuthEndpoint) {
            window.dispatchEvent(
                new Event('auth:session-expired')
            );
        }

        if (status === 400 ){
            return Promise.reject({ type: 'validations', errors: data });
        }

        return Promise.reject({ type: 'server', errors: data, status });
    }
);

export default http;