import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ENV } from './env';
import { getToken } from '@/services/tokenService';

export class ApiService {
  private axiosInstance: AxiosInstance;
  constructor(baseURL: string, headers?: object) {
    this.axiosInstance = axios.create({
      baseURL,
      headers,
      timeout: 1000,
    });
  }

  addRequestInterceptor(
    onFulfilled?: (
      value: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
    onRejected?: (error: any) => any
  ) {
    this.axiosInstance.interceptors.request.use(onFulfilled, onRejected);
  }

  addResponseInterceptor(
    onFulfilled?: (
      value: AxiosResponse
    ) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: AxiosError) => any
  ) {
    this.axiosInstance.interceptors.response.use(onFulfilled, onRejected);
  }

  async GET<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>['data']> {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async POST<T>(url: string, data: T, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async PUT<T>(url: string, data: T, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async DELETE(url: string, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.delete(url, config);
    return response.data;
  }
}

const MainApi = new ApiService(ENV.VITE_API_URL, {
  'Content-Type': 'application/json',
});

MainApi.addRequestInterceptor(async req => {
  const token = getToken();

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

MainApi.addResponseInterceptor(
  res => {
    return res;
  },
  error => {
    if (error.response) {
      console.error(`Server responded with ${error.response.status}`);
      console.error(error.response.data);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error(`No response was received`, error.request);
    } else {
      console.error(`App error `, error.message);
    }
    throw error;
  }
);

export { MainApi };
