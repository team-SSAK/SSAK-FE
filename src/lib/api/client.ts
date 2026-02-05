import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../utils/storage";
import type { LoginResponse } from "./types";

const API_BASE =
  (Constants as any)?.manifest?.extra?.API_BASE_URL ??
  "https://api.example.com";

const client = axios.create({ baseURL: API_BASE, timeout: 15000 });

// Request interceptor: add access token if available
client.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Queue for failed requests while refreshing
let isRefreshing e;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (err: any) => void;
 []config: AxiosRequestConfig;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      if (token && p.config.headers)
        p.config.headers.Authorization = `Bearer ${token}`;
      p.resolve(client(p.config));
    }
  });
  failedQueue = [];
};

// Use a separate axios instance for refresh to avoid interceptor loops
const refreshClient = axios.create({ baseURL: API_BASE, timeout: 15000 });

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalConfig = error.config;
    if (
      error.response?.status === 401 &&
      originalConfig &&
      !(originalConfig as any)._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      (originalConfig as any)._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw error;

        const r = await refreshClient.post<LoginResponse>("/auth/refresh", {
          refreshToken,
        });
        await setAccessToken(r.data.accessToken);
        if (r.data.refreshToken) await setRefreshToken(r.data.refreshToken);

        processQueue(null, r.data.accessToken);
        return client(originalConfig);
      } catch (err) {
        processQueue(err, null);
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  },
);

export default client;
