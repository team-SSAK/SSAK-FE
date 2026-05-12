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
import PopUp from "../../components/popup";
import StepIndicator from "../../components/stepindicator";
import { resetpw } from "../../src/services/auth/resetpw.service";

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

export default function FoundPWPW() {
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNextEnabled =
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    password === confirmPassword;

  const handleNext = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setPopupMessage("새 비밀번호를 모두 입력해주세요");
      setShowPopup(true);
      return;
    }

    if (password !== confirmPassword) {
      setPopupMessage("입력된 비밀번호가 일치한지 확인해주세요");
      setShowPopup(true);
      return;
    }

    if (!email.trim()) {
      setPopupMessage("이메일 정보가 없습니다. 처음부터 다시 진행해주세요");
      setShowPopup(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await resetpw({
        email: email.trim(),
        newPassword: password,
      });
      router.replace("/auth/landing");
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setPopupMessage(
        err?.response?.data?.message ||
          err?.message ||
          "비밀번호 재설정에 실패했습니다",
      );
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
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
          onChangeText={(text) => setPassword(text)}
          value={password}
        />

        <View className="h-8" />

        <Text className="text-green-900 text-2xl font-semibold my-3.5">
          새 비밀번호를 한번 더 입력해주세요
        </Text>

        <PWInput
          placeholder="비밀번호를 입력해주세요"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          disabled={password.length === 0}
        />
      </View>

      <View className="w-full flex-row gap-2.5 px-4 py-2.5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-[52px] px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={!isNextEnabled || isSubmitting}
          className={`flex-1 h-[52px] rounded-xl items-center justify-center ${
            isNextEnabled && !isSubmitting ? "bg-[#45B310]" : "bg-slate-300"
          }`}
        >
          <Text className="text-white text-lg font-medium">
            {isSubmitting ? "처리 중..." : "다음"}
          </Text>
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
