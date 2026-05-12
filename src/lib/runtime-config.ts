import Constants from "expo-constants";

type ExpoExtraConfig = {
  API_BASE_URL?: string;
};

type ExpoConfigLike = {
  extra?: ExpoExtraConfig;
  scheme?: string | string[];
};

type ConstantsWithLegacyManifest = typeof Constants & {
  expoConfig?: ExpoConfigLike;
  manifest2?: {
    extra?: ExpoExtraConfig;
  };
  manifest?: {
    extra?: ExpoExtraConfig;
    scheme?: string | string[];
  };
};

const constants = Constants as ConstantsWithLegacyManifest;
const DEFAULT_APP_SCHEME = "ssak";

const normalizeString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getExpoConfigExtra = (): ExpoExtraConfig | undefined =>
  constants.expoConfig?.extra;

const getLegacyManifestExtraConfig = (): ExpoExtraConfig | undefined =>
  constants.manifest2?.extra ?? constants.manifest?.extra;

const pickScheme = (value: string | string[] | undefined): string | null => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const normalized = normalizeString(item);
      if (normalized) {
        return normalized;
      }
    }

    return null;
  }

  return normalizeString(value);
};

export const getApiBaseUrl = (): string | null => {
  const configuredValue =
    normalizeString(process.env.EXPO_PUBLIC_API_BASE_URL) ??
    normalizeString(getExpoConfigExtra()?.API_BASE_URL) ??
    normalizeString(getLegacyManifestExtraConfig()?.API_BASE_URL) ??
    normalizeString(process.env.API_BASE_URL);

  return configuredValue ? stripTrailingSlash(configuredValue) : null;
};

export const API_BASE_URL = getApiBaseUrl();

export const buildApiUrl = (path: string): string | null => {
  if (!API_BASE_URL) {
    return null;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getAppScheme = (): string =>
  pickScheme(constants.expoConfig?.scheme ?? constants.manifest?.scheme) ??
  DEFAULT_APP_SCHEME;
