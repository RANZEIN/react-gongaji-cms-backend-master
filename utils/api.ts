import axios from 'axios';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME, STATIC_BEARER_TOKEN } from './constants';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = Cookies.get(AUTH_COOKIE_NAME) ?? STATIC_BEARER_TOKEN;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
