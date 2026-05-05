import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN";
const LIKED_POST_IDS_KEY = "LIKED_POST_IDS";
const OWNER_SIGNUP_CLICKED_KEY = "OWNER_SIGNUP_CLICKED";
const SOCIAL_LOGIN_PENDING_KEY = "SOCIAL_LOGIN_PENDING";
const CAMERA_GUIDE_SKIP_KEY = "CAMERA_GUIDE_SKIP";

// Expo Go/RN 환경에서는 window가 있어도 web이 아닐 수 있으므로 Platform 기준으로 분기한다.
const isWeb = Platform.OS === "web";

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

const getJsonItem = async <T>(key: string, fallbackValue: T): Promise<T> => {
  const rawValue = await getItem(key);

  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch (e) {
    console.warn("[Storage] JSON parse failed:", e);
    return fallbackValue;
  }
};

const setJsonItem = async (key: string, value: unknown): Promise<void> => {
  try {
    await setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[Storage] JSON stringify failed:", e);
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
  await deleteItem(LIKED_POST_IDS_KEY);
  await deleteItem(CAMERA_GUIDE_SKIP_KEY);
};

export const getLikedPostIds = async (): Promise<string[]> => {
  const value = await getJsonItem<unknown>(LIKED_POST_IDS_KEY, []);

  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
};

export const setLikedPostIds = async (postIds: string[]) =>
  await setJsonItem(LIKED_POST_IDS_KEY, postIds);

export const getOwnerSignupClicked = async (): Promise<boolean> => {
  const value = await getItem(OWNER_SIGNUP_CLICKED_KEY);
  return value === "true";
};

export const setOwnerSignupClicked = async (clicked: boolean) =>
  await setItem(OWNER_SIGNUP_CLICKED_KEY, clicked ? "true" : "false");

export const getCameraGuideSkip = async (): Promise<boolean> => {
  const value = await getItem(CAMERA_GUIDE_SKIP_KEY);
  return value === "true";
};

export const setCameraGuideSkip = async (skip: boolean) =>
  await setItem(CAMERA_GUIDE_SKIP_KEY, skip ? "true" : "false");

export const clearOwnerSignupClicked = async () =>
  await deleteItem(OWNER_SIGNUP_CLICKED_KEY);

export const getSocialLoginPending = async (): Promise<boolean> => {
  const value = await getItem(SOCIAL_LOGIN_PENDING_KEY);
  return value === "true";
};

export const setSocialLoginPending = async (pending: boolean) =>
  await setItem(SOCIAL_LOGIN_PENDING_KEY, pending ? "true" : "false");

export const clearSocialLoginPending = async () =>
  await deleteItem(SOCIAL_LOGIN_PENDING_KEY);
