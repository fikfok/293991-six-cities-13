import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import { AppRoute, BACKEND_URL, HTTP_CODES_TO_DISPLAY, REQUEST_TIMEOUT } from '../const';
import { getToken } from './token';
import { ErrorResponse } from '../types/error-response';
import { redirectToRoute, setError } from '../store/action';
import { store } from '../store';
import { StatusCodes } from 'http-status-codes';


export const createAPI = ():AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers['X-Token'] = token;
      }

      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponse>) => {
      if (error.response && HTTP_CODES_TO_DISPLAY.includes(error.response.status)) {
        store.dispatch(setError(error.response.data));
      }

      throw error;
    }
  );

  return api;
};
