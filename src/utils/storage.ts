import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN";

export const getAccessToken = async (): Promise<string | null> =>
  await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

export const setAccessToken = async (token: string) =>
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);

export const deleteAccessToken = async () =>
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);

export const getRefreshToken = async (): Promise<string | null> =>
  await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

export const setRefreshToken = async (token: string) =>
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);

export const deleteRefreshToken = async () =>
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

export const clearAll = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};
