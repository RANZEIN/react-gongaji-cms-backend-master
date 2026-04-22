import Cookies from 'js-cookie';
import api from '@/utils/api';
import { AUTH_CLIENT_ID, AUTH_COOKIE_NAME, BASE_URL_AUTH } from '@/utils/constants';

/**
 * API Version
 */
const API_VERSION = 'v3';

/**
 * Extract token dari berbagai kemungkinan response backend
 */
const extractToken = (payload) => {
  const tokenFromData =
    payload?.data?.token ||
    payload?.data?.access_token ||
    payload?.data?.bearer_token;

  const tokenFromRoot =
    payload?.token ||
    payload?.access_token ||
    payload?.bearer_token;

  return tokenFromData || tokenFromRoot || '';
};

/**
 * Version Header
 */
const withVersion = () => ({
  headers: {
    Version: API_VERSION,
  },
});

/**
 * Sign In
 */
export const signin = async (values) => {
  const identifier =
    values?.credential ||
    values?.email ||
    values?.username ||
    values?.user_name ||
    '';

  const payload = {
    id: identifier,
    Id: identifier,
    password: values.password,
    user_name: values?.user_name || values?.username || identifier,
  };

  const { data } = await api.post(
    `${BASE_URL_AUTH}/v1/auth-psw/signin`,
    payload,
    withVersion()
  );

  const token = extractToken(data);
  if (token) {
    Cookies.set(AUTH_COOKIE_NAME, token, { expires: 1 });
  }

  return data;
};

/**
 * Sign Up
 */
export const signup = async (values) => {
  const payload = {
    id: AUTH_CLIENT_ID,
    Id: AUTH_CLIENT_ID,
    fullname: values?.fullname,
    username: values?.username || values?.user_name,
    email: values?.email,
    password: values.password,
  };

  const { data } = await api.post(
    `${BASE_URL_AUTH}/v1/auth-psw/signup`,
    payload,
    withVersion()
  );

  const token = extractToken(data);
  if (token) {
    Cookies.set(AUTH_COOKIE_NAME, token, { expires: 1 });
  }

  return data;
};

/**
 * Sign Out
 */
export const signout = () => {
  Cookies.remove(AUTH_COOKIE_NAME);
};
