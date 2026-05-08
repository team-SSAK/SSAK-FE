import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Platform,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import EyeOff from "../../assets/images/eye-slash.svg";
import Eye from "../../assets/images/eye.svg";
import StepIndicator from "../../components/stepindicator";

interface PWInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  disabled?: boolean;
}

function PWInput({
  placeholder,
  onChangeText,
  value,
  disabled = false,
}: PWInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View
      className="self-stretch p-4 rounded-lg justify-between items-center flex flex-row"
      style={{
        backgroundColor: disabled ? "#F1F5F9" : "#F3F4F6",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor={disabled ? "#94A3B8" : "#6B7280"}
        className="text-gray-900 font-medium leading-6 flex-1"
        secureTextEntry={!isPasswordVisible}
        onChangeText={onChangeText}
        value={value}
        editable={!disabled}
        showSoftInputOnFocus={Platform.OS === "android" ? true : undefined}
      />
      <TouchableOpacity
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        disabled={disabled}
      >
        {isPasswordVisible ? (
          <Eye width={20} height={20} color="#94A3B8" />
        ) : (
          <EyeOff width={20} height={20} color="#94A3B8" />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function RegisterPW() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { email } = useLocalSearchParams<{ email: string }>();
  const isNextEnabled =
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    password === confirmPassword;

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
            회원가입
          </Text>
        </View>
        <StepIndicator currentStep={2} />
        <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
          비밀번호를 입력해주세요
        </Text>
        <PWInput
          placeholder="비밀번호를 입력해주세요"
          onChangeText={(text) => {
            setPassword(text);
            setErrorMsg("");
          }}
          value={password}
        />
        <View className="h-8" />
        <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
          비밀번호를 한번 더 입력해주세요
        </Text>
        <PWInput
          placeholder="비밀번호를 입력해주세요"
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrorMsg("");
          }}
          value={confirmPassword}
          disabled={password.length === 0}
        />
        {errorMsg ? (
          <Text className="text-red-500 text-sm font-medium mt-2">
            {errorMsg}
          </Text>
        ) : null}
      </View>

      <View className="w-full flex-row gap-2.5 px-4 py-2.5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-[52px] px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!password.trim() || !confirmPassword.trim()) {
              setErrorMsg("비밀번호를 모두 입력해주세요");
              return;
            }

            if (password !== confirmPassword) {
              setErrorMsg("입력된 비밀번호가 일치하지 않습니다");
              return;
            }

            if (!email?.trim()) {
              setErrorMsg("이메일 정보가 없습니다. 처음부터 다시 진행해주세요");
              return;
            }

            router.push({
              pathname: "/auth/registername",
              params: {
                email: email.trim(),
                password,
              },
            });
          }}
          disabled={!isNextEnabled}
          className={`flex-1 h-[52px] rounded-xl items-center justify-center ${
            isNextEnabled ? "bg-[#45B310]" : "bg-slate-300"
          }`}
        >
          <Text className="text-white text-lg font-medium">다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
