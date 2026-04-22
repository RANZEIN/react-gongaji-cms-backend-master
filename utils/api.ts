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

    // Let browser set multipart boundary automatically.
    if (config.data instanceof FormData && config.headers) {
        delete config.headers['Content-Type'];
    }

    return config;
});

export default api;
