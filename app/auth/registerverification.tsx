import TextInput from "@/components/input/textinput";
import StepIndicator from "@/components/stepindicator";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import { useVerifyEmail } from "../../src/hooks/useVerifyEmail";

export default function RegisterVerification() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [verificationCode, setVerificationCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: verifyEmail, isPending } = useVerifyEmail();

  const isButtonEnabled = verificationCode.length > 0 && !isPending;

  const onVerify = () => {
    if (!email) return;

    setErrorMsg(null);

    verifyEmail(
      {
        email,
        code: verificationCode,
        type: "SIGNUP",
      },
      {
        onSuccess: () => {
          router.push({
            pathname: "/auth/registerpw",
            params: { email },
          });
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "인증에 실패했습니다.";
          setErrorMsg(msg);
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">회원가입</Text>
        </View>

        <StepIndicator currentStep={1} />

        <Text className="text-green-900 text-2xl font-semibold my-3.5">
          메일로 온 인증번호를 입력해주세요
        </Text>

        <TextInput
          placeholder="인증 번호를 입력해주세요"
          onChangeText={setVerificationCode}
          value={verificationCode}
        />

        {errorMsg ? (
          <Text className="text-red-600 mt-2">{errorMsg}</Text>
        ) : null}
      </View>

      <View className="flex flex-col gap-[60px]">
        <View className="flex flex-col">
          <Text className="text-center text-gray-500 text-xs">
            메일이 오지 않나요?
          </Text>
          <TouchableOpacity>
            <Text className="text-center text-green-500 text-sm underline">
              메일 재요청
            </Text>
          </TouchableOpacity>
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
            onPress={onVerify}
            className="flex-1 h-12 rounded-xl items-center justify-center"
            style={{
              backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
              opacity: isButtonEnabled ? 1 : 0.5,
            }}
          >
            <Text className="text-white text-lg font-medium">
              {isPending ? "확인 중..." : "다음"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
