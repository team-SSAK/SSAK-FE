import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
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
import client from "../../src/lib/api/client";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../../src/utils/storage";

WebBrowser.maybeCompleteAuthSession();

/* ================= OAuth URLs ================= */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const GOOGLE_OAUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;
const KAKAO_OAUTH_URL = `${API_BASE_URL}/oauth2/authorization/kakao`;
/* ============================================== */

/* ================= Login API ================== */
interface LoginRequest {
  userEmail: string;
  userPw: string;
}

const login = async (request: LoginRequest) => {
  const res = await client.post("/api/auth/login", request);

  const accessToken = res.data.accessToken;
  const refreshToken = res.data.refreshToken;

  // 토큰 저장
  if (accessToken) await setAccessToken(accessToken);
  if (refreshToken) await setRefreshToken(refreshToken);

  return res.data;
};

const exchangeOAuthCode = async (code: string) => {
  console.log("[OAuth] /api/auth/token 요청 시작", {
    codePreview: `${code.slice(0, 8)}...`,
    codeLength: code.length,
  });

  const res = await client.post("/api/auth/token", { code });

  const accessToken = res.data.accessToken;
  const refreshToken = res.data.refreshToken;

  if (accessToken) await setAccessToken(accessToken);
  if (refreshToken) await setRefreshToken(refreshToken);

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
  const incomingUrl = Linking.useURL();
  const hasProcessedOAuthCode = useRef(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLoginEnabled = email.length > 7 && password.length > 7;

  /* ============ Login Mutation ============ */
  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),

    // 로그인 성공 후 토큰 확인 + 이동
    onSuccess: async () => {
      const token = await getAccessToken();
      console.log("저장된 토큰:", token);

      router.replace("/home/home");
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

  const onLogin = () => {
    setErrorMsg(null);
    loginMutate({
      userEmail: email,
      userPw: password,
    });
  };

  const handleOAuthCode = async (code: string) => {
    console.log("[OAuth] 인가 코드 수신", {
      codePreview: `${code.slice(0, 8)}...`,
      codeLength: code.length,
      platform: Platform.OS,
    });

    hasProcessedOAuthCode.current = true;
    setErrorMsg(null);

    try {
      await exchangeOAuthCode(code);

      if (Platform.OS === "web" && typeof window !== "undefined") {
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState({}, "", cleanUrl);
      }

      console.log("[OAuth] 토큰 저장 완료, 홈으로 이동");
      router.replace("/home/home");
    } catch (err: any) {
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
    }
  };

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const currentUrl =
        Platform.OS === "web" && typeof window !== "undefined"
          ? window.location.href
          : incomingUrl;

      console.log("[OAuth] 콜백 URL 감지", {
        platform: Platform.OS,
        hasUrl: Boolean(currentUrl),
        currentUrl,
      });

      if (!currentUrl || hasProcessedOAuthCode.current) {
        return;
      }

      const parsed = Linking.parse(currentUrl);
      const code = parsed.queryParams?.code;
      const error = parsed.queryParams?.error;

      console.log("[OAuth] 콜백 파싱 결과", {
        path: parsed.path,
        hasCode: typeof code === "string" && code.trim().length > 0,
        error,
      });

      if (typeof error === "string") {
        setErrorMsg(`소셜 로그인에 실패했습니다. (${error})`);
        return;
      }

      if (typeof code !== "string" || code.trim().length === 0) {
        return;
      }

      await handleOAuthCode(code);
    };

    handleOAuthCallback();
  }, [incomingUrl]);

  /* ============ OAuth Handlers ============ */
  const openOAuth = async (url: string) => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined");
      return;
    }

    console.log("[OAuth] 로그인 시작", {
      platform: Platform.OS,
      requestUrl: url,
    });

    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      const redirectUri = Linking.createURL("/auth/landing");
      const authUrl = `${url}?redirect_uri=${encodeURIComponent(redirectUri)}`;

      console.log("[OAuth] openAuthSessionAsync 호출", {
        redirectUri,
        authUrl,
      });

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
      );

      console.log("[OAuth] openAuthSessionAsync 결과", {
        type: result.type,
        resultUrl: result.type === "success" ? result.url : undefined,
      });

      if (result.type !== "success") {
        return;
      }

      const parsed = Linking.parse(result.url);
      const code = parsed.queryParams?.code;
      const error = parsed.queryParams?.error;

      if (typeof error === "string") {
        setErrorMsg(`소셜 로그인에 실패했습니다. (${error})`);
        return;
      }

      if (typeof code !== "string" || code.trim().length === 0) {
        setErrorMsg("인가 코드(code)를 받지 못했습니다.");
        return;
      }

      await handleOAuthCode(code);
    }
  };

  const onGoogleLogin = () => openOAuth(GOOGLE_OAUTH_URL);
  const onKakaoLogin = () => openOAuth(KAKAO_OAUTH_URL);
  /* ======================================== */

  return (
    <View className="flex-1 bg-[#ffffff] justify-center p-4">
      <View className="flex flex-col gap-3 justify-center items-center mb-[64.5px]">
        <Text className="text-green-400 text-sm font-medium leading-6">
          싹 비우고, 싹 틔우다
        </Text>
        <Text className="text-green-500 text-7xl font-normal">싹</Text>
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
        disabled={!isLoginEnabled || isPending}
        onPress={onLogin}
        className={`self-stretch h-[52px] px-4 rounded-xl justify-center my-[18px] ${
          isLoginEnabled ? "bg-[#45B310]" : "bg-gray-500"
        }`}
      >
        <Text className="text-center text-white text-lg font-medium">
          {isPending ? "로그인 중..." : "로그인하기"}
        </Text>
      </TouchableOpacity>

      <View className="self-stretch flex flex-row gap-7 justify-center items-center mb-[50px]">
        <TouchableOpacity onPress={() => router.push("/auth/foundpwemail")}>
          <Text className="text-gray-600 font-medium underline">
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/registeremail")}>
          <Text className="text-green-500 font-medium underline">회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* OAuth Buttons */}
      <View className="self-stretch flex flex-row gap-3 justify-center items-center">
        <TouchableOpacity
          onPress={onGoogleLogin}
          className="w-28 h-12 px-11 py-3.5 bg-white rounded-3xl shadow flex justify-center items-center"
        >
          <Google width={16} height={16} />
        </TouchableOpacity>

        <View className="w-28 h-12 px-11 py-3.5 bg-white rounded-3xl shadow flex justify-center items-center">
          <Apple width={16} height={16} />
        </View>

        <TouchableOpacity
          onPress={onKakaoLogin}
          className="w-28 h-12 px-7 py-3 bg-yellow-400 rounded-3xl shadow flex justify-center items-center"
        >
          <Text className="text-zinc-900 text-sm font-semibold">KaKao</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
