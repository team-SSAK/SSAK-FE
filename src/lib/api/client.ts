import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import {
  clearOAuthRedirectPending,
  clearSocialLoginPending,
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../utils/storage";
import { API_BASE_URL } from "../runtime-config";
import type { LoginResponse } from "./types";

const API_BASE = API_BASE_URL ?? undefined;
const AUTH_REFRESH_PATH = "/api/auth/refresh";
const AUTH_EXCLUDED_REFRESH_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/token",
  AUTH_REFRESH_PATH,
]);

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

type RetryableAxiosConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const normalizeToken = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const isRefreshExcludedRequest = (config: AxiosRequestConfig | undefined) => {
  const url = config?.url;

  return typeof url === "string" && AUTH_EXCLUDED_REFRESH_PATHS.has(url);
};

const redirectToLogin = async () => {
  await clearOAuthRedirectPending();
  await clearSocialLoginPending();

  try {
    router.replace("/auth/landing");
  } catch (error) {
    console.warn("[API] Failed to redirect to login after refresh failure.", {
      error,
    });
  }
};

const clearAuthAndRedirect = async () => {
  await deleteAccessToken();
  await deleteRefreshToken();
  await redirectToLogin();
};

const persistRefreshedTokens = async (
  response: LoginResponse,
  currentRefreshToken: string,
) => {
  const nextAccessToken = normalizeToken(response.accessToken);
  const nextRefreshToken =
    normalizeToken(response.refreshToken) ?? currentRefreshToken;

  if (!nextAccessToken) {
    throw new Error("리프레시 응답에 access token이 없습니다.");
  }

  await setAccessToken(nextAccessToken);
  await setRefreshToken(nextRefreshToken);

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
  };
};

const setAuthorizationHeader = (
  config: AxiosRequestConfig | RetryableAxiosConfig,
  token: string,
) => {
  const headers = AxiosHeaders.from(config.headers as any);
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
};

////////////////////////////////////////////////////////////////////////////////
// REQUEST INTERCEPTOR
////////////////////////////////////////////////////////////////////////////////

client.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    setAuthorizationHeader(config, token);
  }

  if (SHOULD_LOG) {
    console.log("================================");
    console.log("API REQUEST");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("Method:", config.method);
    console.log("Headers:", config.headers);
    console.log("Params:", config.params);
    console.log("Body:", config.data);
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
  config: RetryableAxiosConfig;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      if (token) {
        setAuthorizationHeader(p.config, token);
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

    const originalConfig = error.config as RetryableAxiosConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalConfig &&
      !originalConfig._retry &&
      !isRefreshExcludedRequest(originalConfig)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw error;

        const r = await refreshClient.post<LoginResponse>(
          AUTH_REFRESH_PATH,
          undefined,
          {
            headers: {
              "Refresh-Token": refreshToken,
            },
          },
        );

        const refreshedTokens = await persistRefreshedTokens(
          r.data,
          refreshToken,
        );

        if (SHOULD_LOG) {
          console.log("[API] Refresh token rotation succeeded.", {
            hasAccessToken: Boolean(refreshedTokens.accessToken),
            hasRefreshToken: Boolean(refreshedTokens.refreshToken),
          });
        }

        setAuthorizationHeader(originalConfig, refreshedTokens.accessToken);

        processQueue(null, refreshedTokens.accessToken);
        return client(originalConfig);
      } catch (err) {
        await clearAuthAndRedirect();
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
