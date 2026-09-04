
import http from './http';

export const signup = (userData) => 
    http.post('/auth/signup', userData);

export const login = (email, password) => 
    http.post('/auth/login', { email, password });

export const logout = () => 
    http.delete('/auth/logout');

export const verify = () => 
    http.get('/auth/verify');