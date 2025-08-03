import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const request: AxiosInstance = axios.create({
    baseURL: 'http://localhost:7001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// // 请求拦截器
// request.interceptors.request.use((config: AxiosRequestConfig) => {
//     // 可在此添加token等逻辑
//     return config;
// });
//
// // 响应拦截器
// request.interceptors.response.use(
//     (response) => response.data,  // 直接返回data字段
//     (error) => {
//         // 统一错误处理
//         return Promise.reject(error);
//     }
// );

export default request;