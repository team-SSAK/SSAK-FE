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
  (process.env.EXPO_PUBLIC_API_BASE_URL as string | undefined) ??
  (process.env.API_BASE_URL as string | undefined) ??
  (Constants as any)?.manifest?.extra?.API_BASE_URL;

if (!API_BASE) {
  console.warn(
    "[API] API_BASE_URL is not configured. Check .env or app.json extra.",
  );
}

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

const SHOULD_LOG =
  process.env.API_LOG === "true" || (typeof __DEV__ !== "undefined" && __DEV__);

////////////////////////////////////////////////////////////////////////////////
// REQUEST INTERCEPTOR
////////////////////////////////////////////////////////////////////////////////

client.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (SHOULD_LOG) {
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;
    const requestBody = isFormData
      ? { formDataParts: (config.data as any)?._parts }
      : config.data;

    console.log("================================");
    console.log("API REQUEST");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("Method:", config.method);
    console.log("Headers:", config.headers);
    console.log("Params:", config.params);
    console.log("Body:", requestBody);
    console.log("================================");
  }

  return config;
});

////////////////////////////////////////////////////////////////////////////////
// REFRESH LOGIC
////////////////////////////////////////////////////////////////////////////////

let isRefreshing = false;

let failedQueue: {
  resolve: (value?: any) => void;
  reject: (err: any) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      if (token && p.config.headers) {
        p.config.headers.Authorization = `Bearer ${token}`;
      }
      p.resolve(client(p.config));
    }
  });
  failedQueue = [];
};

const refreshClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

////////////////////////////////////////////////////////////////////////////////
// RESPONSE INTERCEPTOR
////////////////////////////////////////////////////////////////////////////////

client.interceptors.response.use(
  (response) => {
    if (SHOULD_LOG) {
      console.log("================================");
      console.log("API RESPONSE");
      console.log("URL:", response.config?.url);
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("================================");
    }

    return response;
  },
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    if (SHOULD_LOG) {
      console.log("================================");
      console.log("API ERROR");
      console.log("URL:", error.config?.url);
      console.log("Method:", error.config?.method);
      console.log("Status:", error.response?.status);
      console.log("Response Data:", error.response?.data);
      console.log("Error Message:", error.message);
      console.log("Base URL:", API_BASE);
      console.log("================================");
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

        if (r.data.refreshToken) {
          await setRefreshToken(r.data.refreshToken);
        }

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
