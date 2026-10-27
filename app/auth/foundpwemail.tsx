import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import TextInput from "../../components/input/textinput";
import StepIndicator from "../../components/stepindicator";
import { useSendEmail } from "../../src/hooks/useSendEmail";

export default function FoundPWEmail() {
  const [email, setEmail] = useState("");
  const { mutate: sendEmail, isPending } = useSendEmail();
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
          <TouchableOpacity onPress={() => router.push("/auth/landing")}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
            비밀번호 찾기
          </Text>
        </View>

        <StepIndicator currentStep={0} />

        <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
          가입된 이메일을 입력해주세요
        </Text>

        <TextInput
          placeholder="이메일을 입력해주세요"
          onChangeText={(text) => {
            setEmail(text);
            setErrorMsg("");
          }}
          value={email}
        />
      </View>

      <View>
        <TouchableOpacity
          onPress={() => {
            if (!email.trim()) {
              setErrorMsg("이메일을 입력해주세요");
              return;
            }

            sendEmail(
              { email: email.trim(), type: "PASSWORD_RESET" },
              {
                onSuccess: () => {
                  router.push({
                    pathname: "/auth/foundpwverification",
                    params: { email: email.trim() },
                  });
                },
                onError: (error: any) => {
                  const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "이메일 발송에 실패했습니다";
                  setErrorMsg(message);
                },
              },
            );
          }}
          disabled={isPending}
        >
          <View
            className={`self-stretch h-[52px] p-3 rounded-xl justify-center items-center ${
              isPending ? "bg-slate-300" : "bg-[#45B310]"
            }`}
          >
            {isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center text-white text-lg font-medium leading-7">
                인증 요청
              </Text>
            )}
          </View>
        </TouchableOpacity>
        {errorMsg && (
          <Text className="text-red-500 text-sm font-medium mt-2">
            {errorMsg}
          </Text>
        )}
      </View>
    </View>
  );
}
