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
          <Eye
            width={20}
            height={20}
            color={disabled ? "#94A3B8" : "#94A3B8"}
          />
        ) : (
          <EyeOff
            width={20}
            height={20}
            color={disabled ? "#94A3B8" : "#94A3B8"}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function RegisterPW() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const isButtonEnabled = password.length > 0 && confirmPassword.length > 0;

  const handleNext = () => {
    if (password !== confirmPassword) {
      setShowPopup(true);
    } else {
      router.push({
        pathname: "/auth/registername",
        params: {
          email,
          password,
        },
      });
    }
  };

  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
          <TouchableOpacity onPress={() => router.push("/auth/landing")}>
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
          onChangeText={setPassword}
          value={password}
        />
        <View className="h-8" />
        <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
          비밀번호를 한번 더 입력해주세요
        </Text>
        <PWInput
          placeholder="비밀번호를 입력해주세요"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          disabled={password.length === 0}
        />
      </View>

      <View className="w-full flex-row gap-2.5 px-4 py-2.5">
        {/* 이전: 고정폭 */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-[52px] px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        {/* 다음: flex-1 */}
        <TouchableOpacity
          disabled={!isButtonEnabled}
          onPress={handleNext}
          className="flex-1 h-[52px] rounded-xl items-center justify-center"
          style={{
            backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
            opacity: isButtonEnabled ? 1 : 0.5,
          }}
        >
          <Text className="text-white text-lg font-medium">다음</Text>
        </TouchableOpacity>
      </View>

      {showPopup && (
        <PopUp
          title="비밀번호가 일치하지 않습니다"
          message="입력된 비밀번호가 일치한지 확인해주세요"
          onClose={() => setShowPopup(false)}
        />
      )}
    </View>
  );
}
