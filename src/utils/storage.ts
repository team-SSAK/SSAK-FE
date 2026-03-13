import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN";

// Web에서는 localStorage 사용, 네이티브에서는 SecureStore 사용
const isWeb = typeof window !== "undefined";

const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) {
    try {
      return typeof window !== "undefined" ? localStorage.getItem(key) : null;
    } catch (e) {
      console.warn("[Storage] localStorage access failed:", e);
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.warn("[Storage] SecureStore getItemAsync failed:", e);
    return null;
  }
};

const setItem = async (key: string, value: string): Promise<void> => {
  if (isWeb) {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("[Storage] localStorage setItem failed:", e);
    }
  } else {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn("[Storage] SecureStore setItemAsync failed:", e);
    }
  }
};

const deleteItem = async (key: string): Promise<void> => {
  if (isWeb) {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("[Storage] localStorage removeItem failed:", e);
    }
  } else {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn("[Storage] SecureStore deleteItemAsync failed:", e);
    }
  }
};

export const getAccessToken = async (): Promise<string | null> =>
  await getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = async (token: string) =>
  await setItem(ACCESS_TOKEN_KEY, token);

export const deleteAccessToken = async () => await deleteItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = async (): Promise<string | null> =>
  await getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = async (token: string) =>
  await setItem(REFRESH_TOKEN_KEY, token);

export const deleteRefreshToken = async () =>
  await deleteItem(REFRESH_TOKEN_KEY);

export const clearAll = async () => {
  await deleteAccessToken();
  await deleteRefreshToken();
};
