//axios的封装处理

//根域名配置
//超时时间
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { ApiResponse } from "@/type/api";
const request: AxiosInstance = axios.create({
  baseURL: "http://geek.itheima.net/v1_0",
  timeout: 5000,
});
// 添加请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //操作这个config注入token数据
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

const http = {
  get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return request
      .get<ApiResponse<T>>(url, { params })
      .then((res) => res.data as ApiResponse<T>);
  },
  post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return request
      .post<ApiResponse<T>>(url, data)
      .then((res) => res.data as ApiResponse<T>);
  },
  put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return request
      .put<ApiResponse<T>>(url, data)
      .then((res) => res.data as ApiResponse<T>);
  },
  delete<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return request
      .delete<ApiResponse<T>>(url, { params })
      .then((res) => res.data as ApiResponse<T>);
  },
  fetch<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return request
      .get<ApiResponse<T>>(url, { params })
      .then((res) => res.data as ApiResponse<T>);
  },
};

export default http;
