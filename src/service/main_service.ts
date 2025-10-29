import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../constants/config';
import { getToken } from '../session/session';

// Membuat instance Axios
const createApi = (baseURL: string = BASE_URL) =>
  axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_API_KEY, // hidden di env
      Accept: 'application/json',
    },
  });

const api = createApi();

// Interceptor request: tambahkan token jika ada
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor response: tangani error
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    // cukup reject error asli
    return Promise.reject(error);
  },
);

// 🔥 CORE CRUD FUNCTION
export const apiCore = {
  get: async <T = any>(url: string, params?: any, baseURL: string = BASE_URL): Promise<any> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.get<T>(url, { params });
    return response; // return seluruh response Axios
  },

  post: async <T = any>(url: string, body?: any, baseURL: string = BASE_URL): Promise<any> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.post<T>(url, body);
    return response; // return seluruh response Axios
  },

  put: async <T = any>(url: string, body?: any, baseURL: string = BASE_URL): Promise<any> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.put<T>(url, body);
    return response; // return seluruh response Axios
  },
  putForm: async <T = any>(
    url: string,
    formData: FormData,
    baseURL: string = BASE_URL,
  ): Promise<any> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.put<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response; // return seluruh response Axios
  },

  delete: async <T = any>(url: string, baseURL: string = BASE_URL): Promise<any> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.delete<T>(url);
    return response; // return seluruh response Axios
  },

  postForm: async <T = any>(
    url: string,
    formData: FormData,
    baseURL: string = BASE_URL,
  ): Promise<any> => {
    const client = baseURL === BASE_URL ? api : createApi(baseURL);
    const response = await client.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response; // return seluruh response Axios
  },
};
