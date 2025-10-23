import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
import { BASE_URL } from '@env';

// export const BASE_URL = 'https://hrm.sintecha.com/'; // Product
// export const BASE_URL = 'http://192.168.2.79:5000'; // localHost

const storage = new MMKV();
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào header mỗi lần request
instance.interceptors.request.use(
  (config) => {
    const token = storage.getString('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

// Bắt lỗi token hết hạn
instance.interceptors.response.use(
  (response: any) => response,
  (error: { response: { status: number; data: { error: any } } }) => {
    if (error.response && error.response.status === 401) {
      storage.delete('token');
    }
    if (error.response && error.response.data && error.response.data.error) {
    }
    return Promise.reject(error);
  },
);

const handleError = (error: unknown) => {
  console.error('API Error:', error);
  throw error;
};

const request = {
  get: async (url: any, params = {}, config = {}) => {
    try {
      const res = await instance.get(url, { params, ...config });
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  post: async (url: any, data = {}, config = {}) => {
    try {
      const res = await instance.post(url, data, config);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },
  put: async (url: any, data = {}, config = {}) => {
    try {
      const res = await instance.put(url, data, config);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (url: any, config = {}) => {
    try {
      const res = await instance.delete(url, config);
      return res.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default request;
