import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import EyeOff from "../../assets/images/eye-slash.svg";
import Eye from "../../assets/images/eye.svg";
import PopUp from "../../components/popup";
import StepIndicator from "../../components/stepindicator";
import client from "../../src/lib/api/client";

interface ResetpwRequest {
  email: string;
  newPassword: string;
}

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
      className="self-stretch p-4 rounded-lg flex-row items-center"
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

export default function FoundPWPW() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isButtonEnabled =
    password.length > 0 && confirmPassword.length > 0 && !loading;

  const resetpw = async (request: ResetpwRequest): Promise<void> => {
    await client.post("/api/auth/reset-password", request);
  };

  const handleNext = async () => {
    if (password !== confirmPassword) {
      setPopupMessage("입력된 비밀번호가 일치한지 확인해주세요");
      setShowPopup(true);
      return;
    }

    if (!email) {
      setPopupMessage("이메일 정보가 없습니다. 처음부터 다시 진행해주세요.");
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);

      await resetpw({
        email,
        newPassword: password,
      });

      router.replace("/auth/landing");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "비밀번호 재설정에 실패했습니다.";
      setPopupMessage(message);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View>
        <View className="py-4 flex-row gap-2 items-center mb-10">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">
            비밀번호 찾기
          </Text>
        </View>

        <StepIndicator currentStep={2} />

        <Text className="text-green-900 text-2xl font-semibold my-3.5">
          새 비밀번호를 입력해주세요
        </Text>

        <PWInput
          placeholder="비밀번호를 입력해주세요"
          onChangeText={setPassword}
          value={password}
        />

        <View className="h-8" />

        <Text className="text-green-900 text-2xl font-semibold my-3.5">
          새 비밀번호를 한번 더 입력해주세요
        </Text>

        <PWInput
          placeholder="비밀번호를 입력해주세요"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          disabled={password.length === 0}
        />
      </View>

      <View className="w-full flex-row gap-2.5 px-4 py-2.5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!isButtonEnabled}
          onPress={handleNext}
          className="flex-1 h-12 rounded-xl items-center justify-center"
          style={{
            backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
            opacity: isButtonEnabled ? 1 : 0.5,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-lg font-medium">다음</Text>
          )}
        </TouchableOpacity>
      </View>

      {showPopup && (
        <PopUp
          title="알림"
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </View>
  );
}
