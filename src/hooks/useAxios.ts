import axios from 'axios';
import { useMemo } from 'react';

export const useAxios = () => {
  // 只创建一次实例，避免 useEffect 依赖变化导致重复请求
  const http = useMemo(() => {

    const instance = axios.create({
      baseURL: import.meta.env.MODE === "development" ? 'http://localhost:3001' : '/api',
      timeout: 10000,
    });

    // 拦截器挂在 instance 上（不要挂全局 axios），避免重复注册
    instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );

    return instance;
  }, []);

  return { http };
};