import Constants from "expo-constants";

const API_BASE =
  (process.env.EXPO_PUBLIC_API_BASE_URL as string | undefined) ??
  (process.env.API_BASE_URL as string | undefined) ??
  (Constants as any)?.manifest?.extra?.API_BASE_URL;

const BASE64_CHARS = /^[A-Za-z0-9+/=\r\n]+$/;

const looksLikeBase64 = (value: string) => {
  const normalized = value.replace(/\s/g, "");
  if (normalized.length < 64) {
    return false;
  }

  return BASE64_CHARS.test(normalized);
};

export const resolveImageUri = (raw: string) => {
  const value = raw.trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image") ||
    value.startsWith("file://") ||
    value.startsWith("content://") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  if (API_BASE && value.startsWith("/")) {
    return `${API_BASE}${value}`;
  }

  if (looksLikeBase64(value)) {
    return `data:image/jpeg;base64,${value}`;
  }

  if (API_BASE) {
    return `${API_BASE}/${value.replace(/^\/+/, "")}`;
  }

  return value;
};

export const normalizeImageList = (images: unknown): string[] => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .filter((value): value is string => typeof value === "string")
    .map(resolveImageUri)
    .filter((value) => value.length > 0);
};
