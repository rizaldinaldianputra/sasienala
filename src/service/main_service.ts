import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../constants/config';
import { getToken } from '../session/session';

const createApi = (baseURL: string = BASE_URL) =>
  axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

const api = createApi();

// interceptor request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log('REQUEST:', config.url, config.data);
  return config;
});

// interceptor response
api.interceptors.response.use(
  (res) => {
    console.log('RESPONSE:', res.config.url, res.data);
    return res;
  },
  (error: AxiosError<any>) => {
    const backendMessage =
      (error.response?.data as any)?.message || error.message || 'Terjadi kesalahan';
    console.error('❌ API ERROR:', backendMessage);
    return Promise.reject(new Error(backendMessage));
  },
);

// 🔥 CORE CRUD FUNCTION
export const apiCore = {
  get: async <T = any>(url: string, params?: any, baseURL: string = BASE_URL): Promise<T> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.get<T>(url, { params });
    return response.data;
  },

  post: async <T = any>(url: string, body?: any, baseURL: string = BASE_URL): Promise<T> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.post<T>(url, body);
    return response.data;
  },

  put: async <T = any>(url: string, body?: any, baseURL: string = BASE_URL): Promise<T> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.put<T>(url, body);
    return response.data;
  },

  delete: async <T = any>(url: string, baseURL: string = BASE_URL): Promise<T> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.delete<T>(url);
    return response.data;
  },

  postForm: async <T = any>(
    url: string,
    formData: FormData,
    baseURL: string = BASE_URL,
  ): Promise<T> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
