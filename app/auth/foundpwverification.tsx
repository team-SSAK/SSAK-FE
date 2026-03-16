import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import TextInput from "../../components/input/textinput";
import StepIndicator from "../../components/stepindicator";
import { useVerifyEmail } from "../../src/hooks/useVerifyEmail";

export default function FoundPWVerification() {
  /* -----------------------------
     email params 안전 처리
  ----------------------------- */
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : "";

  const [verificationCode, setVerificationCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: verifyEmail, isPending } = useVerifyEmail();

  const isButtonEnabled = verificationCode.length > 0 && !isPending;

  /* -----------------------------
     인증 요청
  ----------------------------- */
  const onVerify = () => {
    if (!email) return;

    setErrorMsg(null);

    verifyEmail(
      {
        email,
        code: verificationCode,
        type: "PASSWORD_RESET",
      },
      {
        onSuccess: () => {
          router.push({
            pathname: "/auth/foundpwpw",
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
          <TouchableOpacity onPress={() => router.push("/auth/landing")}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">
            비밀번호 찾기
          </Text>
        </View>

        <StepIndicator currentStep={1} />

        <Text className="text-green-900 text-2xl font-semibold my-3.5">
          메일로 온 인증번호를 입력해주세요
        </Text>

        <TextInput
          placeholder="인증 번호를 입력해주세요"
          onChangeText={(text) =>
            setVerificationCode(text.replace(/[^0-9]/g, "").slice(0, 6))
          }
          value={verificationCode}
        />

        {errorMsg && <Text className="text-red-600 mt-2">{errorMsg}</Text>}
      </View>

      <View className="w-full flex-row gap-2.5 px-4 py-2.5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-[52px] px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!isButtonEnabled}
          onPress={onVerify}
          className="flex-1 h-[52px] rounded-xl items-center justify-center"
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
  );
}
