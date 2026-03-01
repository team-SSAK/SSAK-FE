import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  Platform,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import client from "../../src/lib/api/client";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../../src/utils/storage";

import PopUp from "@/components/popup";
import Apple from "../../assets/images/Apple.svg";
import EyeOff from "../../assets/images/eye-slash.svg";
import Eye from "../../assets/images/eye.svg";
import Google from "../../assets/images/google.svg";

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
/* ============================================== */

interface IDInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
}

function IDInput({ placeholder, onChangeText, value }: IDInputProps) {
  return (
    <View className="self-stretch p-4 bg-gray-100 rounded-lg justify-center items-start">
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        className="text-gray-900 font-medium leading-6"
        onChangeText={onChangeText}
        value={value}
        autoCapitalize="none"
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const { showPopup, type } = useLocalSearchParams();

  useEffect(() => {
    const popupValue = Array.isArray(showPopup) ? showPopup[0] : showPopup;

    if (popupValue === "true") {
      setShowDeletePopup(true);
    }
  }, [showPopup]);

  const isDelete = type === "delete";

  const popupTitle = isDelete ? "탈퇴 완료" : "알림";
  const popupMessage = isDelete ? "회원탈퇴가 완료되었습니다." : "";

  const isLoginEnabled = email.length > 7 && password.length > 7;

  /* ============ Login Mutation ============ */
  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),

    // 로그인 성공 후 토큰 확인 + 이동
    onSuccess: async () => {
      const token = await getAccessToken();
      console.log("저장된 토큰:", token);

      router.replace("/mypage/main");
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

  /* ============ OAuth Handlers ============ */
  const openOAuth = async (url: string) => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined");
      return;
    }

    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  const onGoogleLogin = () => openOAuth(GOOGLE_OAUTH_URL);
  const onKakaoLogin = () => openOAuth(KAKAO_OAUTH_URL);
  /* ======================================== */

  return (
    <>
      {showDeletePopup && (
        <PopUp
          title={popupTitle}
          message={popupMessage}
          onClose={() => setShowDeletePopup(false)}
        />
      )}
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
          className={`self-stretch p-4 rounded-xl justify-center my-[18px] ${
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
            <Text className="text-green-500 font-medium underline">
              회원가입
            </Text>
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
    </>
  );
}
