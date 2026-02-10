import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
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

/* ================= OAuth URLs ================= */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const GOOGLE_OAUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;
const KAKAO_OAUTH_URL = `${API_BASE_URL}/oauth2/authorization/kakao`;
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

  const isLoginEnabled = email.length > 8 && password.length > 8;

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
    <View className="flex-1 bg-[#ffffff] justify-center p-4">
      <View className="flex flex-col gap-3 justify-center items-center mb-[64.5px]">
        <Text className="text-green-400 text-sm font-medium leading-6">
          싹 비우고, 싹 틔우다
        </Text>
        <Text className="text-green-500 text-7xl font-normal font-Jalnan_2 leading-[79.10px]">
          싹
        </Text>
      </View>

      <View className="flex flex-col gap-2.5">
        <IDInput
          placeholder="이메일을 입력해주세요"
          onChangeText={setEmail}
          value={email}
        />
        <Text className="w-full text-right text-gray-500 text-sm font-medium">
          {email.length}/8
        </Text>

        <PWInput
          placeholder="비밀번호를 입력해주세요"
          onChangeText={setPassword}
          value={password}
        />
        <Text className="w-full text-right text-gray-500 text-sm font-medium">
          {password.length}/8
        </Text>
      </View>

      <View
        className={`self-stretch p-4 rounded-xl justify-center my-[18px] ${
          isLoginEnabled ? "bg-[#45B310]" : "bg-gray-500"
        }`}
      >
        <Text className="text-center text-white text-lg font-medium">
          로그인하기
        </Text>
      </View>

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
        {/* Google */}
        <TouchableOpacity
          onPress={onGoogleLogin}
          className="w-28 h-12 px-11 py-3.5 bg-white rounded-3xl shadow outline outline-1 outline-zinc-100 justify-center items-center"
        >
          <Google width={16} height={16} />
        </TouchableOpacity>

        {/* Apple (아직 미구현) */}
        <View className="w-28 h-12 px-11 py-3.5 bg-white rounded-3xl shadow outline outline-1 outline-zinc-100 justify-center items-center">
          <Apple width={16} height={16} />
        </View>

        {/* Kakao */}
        <TouchableOpacity
          onPress={onKakaoLogin}
          className="w-28 h-12 px-7 py-3 bg-yellow-400 rounded-3xl shadow justify-center items-center"
        >
          <Text className="text-zinc-900 text-sm font-semibold">KaKao</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
