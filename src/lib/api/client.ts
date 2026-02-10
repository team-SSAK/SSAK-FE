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
  (process.env.API_BASE_URL as string | undefined) ??
  (Constants as any)?.manifest?.extra?.API_BASE_URL;

if (!API_BASE) {
  console.warn(
    "[API] API_BASE_URL is not configured. Check .env or app.json extra.",
  );
}

const client = axios.create({ baseURL: API_BASE, timeout: 15000 });

// Enable API logging when API_LOG=true in env or in development (__DEV__)
const SHOULD_LOG =
  process.env.API_LOG === "true" || (typeof __DEV__ !== "undefined" && __DEV__);

// Request interceptor: add access token if available
client.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Queue for failed requests while refreshing
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (err: any) => void;
  config: AxiosRequestConfig;
}[] = [];

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
  (response) => {
    if (SHOULD_LOG) {
      console.debug("[API] response", {
        url: response.config?.url,
        method: response.config?.method,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    if (SHOULD_LOG) {
      console.error("[API] error", {
        url: error.config?.url || "no-config",
        method: error.config?.method || "no-config",
        status: error.response?.status || "no-response",
        data: error.response?.data || error.message,
        baseURL: API_BASE,
        errorCode: error.code,
        errorMessage: error.message,
      });
    }

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
