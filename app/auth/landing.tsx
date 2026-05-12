import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Apple from "../../assets/images/Apple.svg";
import EyeOff from "../../assets/images/eye-slash.svg";
import Eye from "../../assets/images/eye.svg";
import Google from "../../assets/images/google.svg";
import Logo from "../../assets/images/logo_green.svg";
import client from "../../src/lib/api/client";
import { buildApiUrl, getAppScheme } from "../../src/lib/runtime-config";
import {
  clearOAuthRedirectPending,
  clearSocialLoginPending,
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getOAuthRedirectPending,
  getOAuthRedirectSession,
  getRefreshToken,
  setAccessToken,
  setOAuthRedirectPending,
  setOAuthRedirectSession,
  setOwnerSignupClicked,
  setRefreshToken,
  setSocialLoginPending,
} from "../../src/utils/storage";

WebBrowser.maybeCompleteAuthSession();

const DEFAULT_OAUTH_CALLBACK_PATH = "auth/landing";
const KAKAO_OAUTH_CALLBACK_PATH = "login/callback";
const OAUTH_SESSION_QUERY_PARAM = "oauth_session";
const GOOGLE_OAUTH_PATH = "/oauth2/authorization/google";
const KAKAO_OAUTH_PATH = "/oauth2/authorization/kakao";
const APPLE_OAUTH_PATH = "/oauth2/authorization/login/apple";

const normalizeString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const normalizePath = (value: string | null | undefined): string =>
  (value ?? "")
    .split("/")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .join("/");

const appendQueryParam = (url: string, key: string, value: string): string => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
};

const createOAuthSessionId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const parseCallbackTarget = (url: string) => {
  const parsed = Linking.parse(url);

  return {
    parsed,
    scheme: normalizeString(parsed.scheme),
    hostname: normalizeString(parsed.hostname),
    normalizedPath: normalizePath(parsed.path),
  };
};

const isExpectedOAuthCallback = (
  url: string,
  expectedBaseUrls: string[],
): boolean => {
  const incoming = parseCallbackTarget(url);

  return expectedBaseUrls.some((expectedBaseUrl) => {
    const expected = parseCallbackTarget(expectedBaseUrl);

    return (
      incoming.scheme === expected.scheme &&
      incoming.hostname === expected.hostname &&
      incoming.normalizedPath === expected.normalizedPath
    );
  });
};

const buildOAuthRequestUrl = (
  providerPath: string,
  redirectUri: string,
): string | null => {
  const baseUrl = buildApiUrl(providerPath);

  if (!baseUrl) {
    return null;
  }

  return `${baseUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
};

const pickQueryValue = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value.find(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  }

  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
};

/* ================= Login API ================== */
interface LoginRequest {
  userEmail: string;
  userPw: string;
}

interface AuthSuccessPayload {
  isNewUser?: boolean;
}

type AuthTokenPayload = {
  accessToken?: unknown;
  refreshToken?: unknown;
};

const persistAuthTokens = async (
  payload: AuthTokenPayload,
  options: { requireRefreshToken: boolean },
) => {
  const accessToken = normalizeString(payload.accessToken);
  const refreshToken = normalizeString(payload.refreshToken);

  if (!accessToken) {
    await deleteAccessToken();
    await deleteRefreshToken();
    throw new Error("액세스 토큰을 저장하지 못했습니다.");
  }

  if (options.requireRefreshToken && !refreshToken) {
    await deleteAccessToken();
    await deleteRefreshToken();
    throw new Error("리프레시 토큰을 저장하지 못했습니다.");
  }

  await setAccessToken(accessToken);

  if (refreshToken) {
    await setRefreshToken(refreshToken);
  } else {
    await deleteRefreshToken();
  }

  return {
    accessToken,
    refreshToken,
  };
};

const login = async (request: LoginRequest) => {
  const res = await client.post("/api/auth/login", request);

  await persistAuthTokens(res.data, {
    requireRefreshToken: true,
  });

  return res.data;
};

const exchangeOAuthCode = async (
  code: string,
): Promise<AuthSuccessPayload> => {
  console.log("[OAuth] /api/auth/token 요청 시작", {
    codePreview: `${code.slice(0, 8)}...`,
    codeLength: code.length,
  });

  const res = await client.post("/api/auth/token", { code });
  const { accessToken, refreshToken } = await persistAuthTokens(res.data, {
    requireRefreshToken: true,
  });

  console.log("[OAuth] /api/auth/token 응답 성공", {
    hasAccessToken: Boolean(accessToken),
    hasRefreshToken: Boolean(refreshToken),
  });

  return res.data;
};
/* ============================================== */

interface IDInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
}

function IDInput({ placeholder, onChangeText, value }: IDInputProps) {
  return (
    <View className="self-stretch p-4 bg-gray-100 rounded-lg flex flex-row items-center">
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        className="text-gray-900 font-medium leading-6 flex-1 w-full"
        onChangeText={onChangeText}
        value={value}
        autoCapitalize="none"
        showSoftInputOnFocus={Platform.OS === "android" ? true : undefined}
      />
    </View>
  );
}

interface PWInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
}

function PWInput({ placeholder, onChangeText, value }: PWInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="self-stretch p-4 bg-gray-100 rounded-lg justify-between items-center flex flex-row">
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        className="text-gray-900 font-medium leading-6 flex-1"
        secureTextEntry={!isPasswordVisible}
        onChangeText={onChangeText}
        value={value}
        showSoftInputOnFocus={Platform.OS === "android" ? true : undefined}
      />
      <TouchableOpacity onPress={() => setIsPasswordVisible((prev) => !prev)}>
        {isPasswordVisible ? (
          <Eye width={20} height={20} color="#94A3B8" />
        ) : (
          <EyeOff width={20} height={20} color="#94A3B8" />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function Landing() {
  const router = useRouter();
  const incomingUrl = Linking.useURL();
  const hasProcessedOAuthCode = useRef(false);
  const isMountedRef = useRef(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOAuthPending, setIsOAuthPending] = useState(false);
  const defaultOAuthRedirectBaseUri = useMemo(
    () =>
      Platform.OS === "web"
        ? Linking.createURL(DEFAULT_OAUTH_CALLBACK_PATH)
        : Linking.createURL(DEFAULT_OAUTH_CALLBACK_PATH, {
            scheme: getAppScheme(),
          }),
    [],
  );
  const kakaoOAuthRedirectBaseUri = useMemo(
    () =>
      Platform.OS === "web"
        ? defaultOAuthRedirectBaseUri
        : Linking.createURL(KAKAO_OAUTH_CALLBACK_PATH, {
            scheme: getAppScheme(),
          }),
    [defaultOAuthRedirectBaseUri],
  );
  const allowedOAuthRedirectBaseUris = useMemo(
    () =>
      Array.from(
        new Set([defaultOAuthRedirectBaseUri, kakaoOAuthRedirectBaseUri]),
      ),
    [defaultOAuthRedirectBaseUri, kakaoOAuthRedirectBaseUri],
  );

  const isLoginEnabled = email.length > 7 && password.length > 7;

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearWebOAuthQuery = useCallback(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const cleanUrl = `${window.location.origin}${window.location.pathname}`;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  const finalizeLogin = useCallback(
    async ({ isNewUser = false }: AuthSuccessPayload) => {
      const [storedAccessToken, storedRefreshToken] = await Promise.all([
        getAccessToken(),
        getRefreshToken(),
      ]);

      console.log("[Auth] 토큰 저장 확인", {
        hasAccessToken: Boolean(storedAccessToken),
        hasRefreshToken: Boolean(storedRefreshToken),
        isNewUser,
      });

      if (!storedAccessToken || !storedRefreshToken) {
        await deleteAccessToken();
        await deleteRefreshToken();
        throw new Error(
          storedAccessToken
            ? "리프레시 토큰 저장에 실패했습니다."
            : "액세스 토큰 저장에 실패했습니다.",
        );
      }

      if (isNewUser) {
        await setSocialLoginPending(true);
        if (isMountedRef.current) {
          router.replace("/auth/registername?socialLogin=true");
        }
        return;
      }

      await clearSocialLoginPending();
      if (isMountedRef.current) {
        router.replace("/home/home");
      }
    },
    [router],
  );

  /* ============ Login Mutation ============ */
  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),

    // 로그인 성공 후 토큰 확인 + 이동
    onSuccess: async () => {
      try {
        await clearOAuthRedirectPending();
        await finalizeLogin({});
      } catch (err: any) {
        const msg = err?.message || "로그인 상태를 확인하지 못했습니다.";
        setErrorMsg(msg);
      }
    },

    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "로그인에 실패했습니다.";
      setErrorMsg(msg);
    },
  });
  /* ======================================== */

  const isAuthLoading = isPending || isOAuthPending;

  const onLogin = () => {
    setErrorMsg(null);
    loginMutate({
      userEmail: email,
      userPw: password,
    });
  };

  const processOAuthCallback = useCallback(
    async (url: string, source: "linking" | "auth-session") => {
      console.log("[OAuth] 콜백 URL 감지", {
        source,
        platform: Platform.OS,
        url,
      });

      if (!url || hasProcessedOAuthCode.current) {
        return;
      }

      if (!isExpectedOAuthCallback(url, allowedOAuthRedirectBaseUris)) {
        console.log("[OAuth] 예상한 콜백 경로가 아니어서 무시합니다.", {
          source,
          url,
          expectedBaseUrls: allowedOAuthRedirectBaseUris,
        });

        if (source === "auth-session") {
          await clearOAuthRedirectPending();
          clearWebOAuthQuery();
          setIsOAuthPending(false);
          setErrorMsg("로그인 콜백 URL이 올바르지 않습니다.");
        }

        return;
      }

      const isRedirectPending = await getOAuthRedirectPending();
      if (!isRedirectPending) {
        console.log("[OAuth] 대기 중인 로그인 세션이 없어 콜백을 무시합니다.");
        return;
      }

      const { parsed, hostname, normalizedPath } = parseCallbackTarget(url);
      const storedSession = await getOAuthRedirectSession();
      const callbackSession = pickQueryValue(
        parsed.queryParams?.[OAUTH_SESSION_QUERY_PARAM],
      );

      if (!storedSession || callbackSession !== storedSession) {
        console.log("[OAuth] 세션 식별자가 일치하지 않아 콜백을 무시합니다.", {
          source,
          hostname,
          normalizedPath,
          hasStoredSession: Boolean(storedSession),
          hasCallbackSession: Boolean(callbackSession),
        });

        if (source === "auth-session") {
          await clearOAuthRedirectPending();
          clearWebOAuthQuery();
          setIsOAuthPending(false);
          setErrorMsg(
            "로그인 세션이 만료되었거나 일치하지 않습니다. 다시 시도해주세요.",
          );
        }

        return;
      }

      const code = pickQueryValue(parsed.queryParams?.code);
      const error =
        pickQueryValue(parsed.queryParams?.error_description) ??
        pickQueryValue(parsed.queryParams?.error);

      console.log("[OAuth] 콜백 파싱 결과", {
        source,
        hostname,
        path: normalizedPath,
        hasCode: Boolean(code),
        error,
        hasMatchingSession: true,
      });

      if (error) {
        await clearOAuthRedirectPending();
        clearWebOAuthQuery();
        setIsOAuthPending(false);
        setErrorMsg(`소셜 로그인에 실패했습니다. (${error})`);
        return;
      }

      if (!code) {
        if (source === "auth-session") {
          await clearOAuthRedirectPending();
          clearWebOAuthQuery();
          setIsOAuthPending(false);
          setErrorMsg("인가 코드(code)를 받지 못했습니다.");
        }
        return;
      }

      if (hasProcessedOAuthCode.current) {
        return;
      }

      console.log("[OAuth] 인가 코드 수신", {
        codePreview: `${code.slice(0, 8)}...`,
        codeLength: code.length,
        platform: Platform.OS,
        source,
      });

      hasProcessedOAuthCode.current = true;
      setErrorMsg(null);

      try {
        const data = await exchangeOAuthCode(code);
        await clearOAuthRedirectPending();
        clearWebOAuthQuery();
        await finalizeLogin(data);
      } catch (err: any) {
        await clearOAuthRedirectPending();
        clearWebOAuthQuery();

        console.log("[OAuth] 토큰 교환 실패", {
          message: err?.message,
          response: err?.response?.data,
        });

        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "소셜 로그인 토큰 발급에 실패했습니다.";

        setErrorMsg(msg);
        hasProcessedOAuthCode.current = false;
      } finally {
        if (isMountedRef.current) {
          setIsOAuthPending(false);
        }
      }
    },
    [allowedOAuthRedirectBaseUris, clearWebOAuthQuery, finalizeLogin],
  );

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!incomingUrl) {
        return;
      }

      await processOAuthCallback(incomingUrl, "linking");
    };

    void handleOAuthCallback();
  }, [incomingUrl, processOAuthCallback]);

  /* ============ OAuth Handlers ============ */
  const openOAuth = async (providerPath: string) => {
    const redirectBaseUri =
      Platform.OS !== "web" && providerPath === KAKAO_OAUTH_PATH
        ? kakaoOAuthRedirectBaseUri
        : defaultOAuthRedirectBaseUri;
    const oauthSession = createOAuthSessionId();
    const redirectUri = appendQueryParam(
      redirectBaseUri,
      OAUTH_SESSION_QUERY_PARAM,
      oauthSession,
    );
    const authUrl = buildOAuthRequestUrl(providerPath, redirectUri);

    if (!authUrl) {
      console.error("[OAuth] API_BASE_URL is not defined");
      setErrorMsg("로그인 설정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    hasProcessedOAuthCode.current = false;
    setErrorMsg(null);
    setIsOAuthPending(true);

    await clearOAuthRedirectPending();
    await clearSocialLoginPending();
    await setOAuthRedirectSession(oauthSession);
    await setOAuthRedirectPending(true);

    console.log("[OAuth] 로그인 시작", {
      platform: Platform.OS,
      providerPath,
      authUrl,
      redirectUri,
      redirectBaseUri,
      oauthSession,
    });

    try {
      if (Platform.OS === "web") {
        window.location.href = authUrl;
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      console.log("[OAuth] openAuthSessionAsync 결과", {
        type: result.type,
        resultUrl: result.type === "success" ? result.url : undefined,
      });

      if (result.type !== "success") {
        await clearOAuthRedirectPending();
        setIsOAuthPending(false);
        return;
      }

      await processOAuthCallback(result.url, "auth-session");
    } catch (err: any) {
      await clearOAuthRedirectPending();
      const msg =
        err?.message || "소셜 로그인 창을 여는 중 문제가 발생했습니다.";
      setErrorMsg(msg);
      if (isMountedRef.current) {
        setIsOAuthPending(false);
      }
    }
  };

  const onGoogleLogin = () => openOAuth(GOOGLE_OAUTH_PATH);
  const onKakaoLogin = () => openOAuth(KAKAO_OAUTH_PATH);
  const onAppleLogin = () => openOAuth(APPLE_OAUTH_PATH);

  const onUserSignupPress = async () => {
    await clearOAuthRedirectPending();
    await clearSocialLoginPending();
    await setOwnerSignupClicked(false);
    router.push("/auth/registeremail");
  };
  /* ======================================== */

  return (
    <View className="flex-1 bg-[#ffffff] justify-center p-4">
      {/* 사장님 로그인 -> 진입 못하게 주석 처리
      <View className="absolute left-4 right-4 top-[72px]">
        <Text className="text-right text-gray-500 text-sm font-medium leading-6">
          식당의 사장님이신가요?
        </Text>
        <TouchableOpacity onPress={onOwnerSignupPress} activeOpacity={0.7}>
          <Text className="mt-[3px] text-right text-green-400 text-base font-semibold underline leading-6">
            사장님 회원가입&gt;
          </Text>
        </TouchableOpacity>
      </View>
     */}

      <View className="flex flex-col gap-3 justify-center items-center mb-[64.5px]">
        <Text className="text-green-400 text-sm font-medium leading-6">
          싹 비우고, 싹 틔우다
        </Text>
        <Logo width={90} height={97} />
      </View>

      <View className="flex flex-col gap-2.5">
        <IDInput
          placeholder="이메일을 입력해주세요"
          onChangeText={setEmail}
          value={email}
        />
        <PWInput
          placeholder="비밀번호를 입력해주세요"
          onChangeText={setPassword}
          value={password}
        />
        {errorMsg && (
          <Text className="text-red-600 text-sm mt-1">{errorMsg}</Text>
        )}
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        disabled={!isLoginEnabled || isAuthLoading}
        onPress={onLogin}
        className={`self-stretch h-[52px] px-4 rounded-xl justify-center my-[18px] ${
          isLoginEnabled ? "bg-[#45B310]" : "bg-gray-500"
        }`}
      >
        <Text className="text-center text-white text-lg font-medium">
          {isAuthLoading ? "로그인 중..." : "로그인하기"}
        </Text>
      </TouchableOpacity>

      <View className="self-stretch flex flex-row gap-7 justify-center items-center mb-[50px]">
        <TouchableOpacity onPress={() => router.push("/auth/foundpwemail")}>
          <Text className="text-gray-600 font-medium underline">
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onUserSignupPress}>
          <Text className="text-green-500 font-medium underline">회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* OAuth Buttons */}
      <View className="self-stretch flex flex-row gap-3 justify-center items-center">
        <TouchableOpacity
          onPress={onGoogleLogin}
          disabled={isAuthLoading}
          className="w-28 h-12 px-11 py-3.5 bg-white rounded-3xl shadow flex justify-center items-center"
        >
          <Google width={16} height={16} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onAppleLogin}
          disabled={isAuthLoading}
          className="w-28 h-12 px-11 py-3.5 bg-white rounded-3xl shadow flex justify-center items-center"
        >
          <Apple width={16} height={16} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onKakaoLogin}
          disabled={isAuthLoading}
          className="w-28 h-12 px-7 py-3 bg-yellow-400 rounded-3xl shadow flex justify-center items-center"
        >
          <Text className="text-zinc-900 text-sm font-semibold">KaKao</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
