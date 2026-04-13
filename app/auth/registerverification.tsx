import TextInput from "@/components/input/textinput";
import StepIndicator from "@/components/stepindicator";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function RegisterVerification() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [verificationCode, setVerificationCode] = useState("");

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
          onChangeText={(text) =>
            setVerificationCode(text.replace(/[^0-9]/g, "").slice(0, 6))
          }
          value={verificationCode}
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
          onPress={() =>
            router.push({
              pathname: "/auth/registerpw",
              params: { email: email || "test@test.com" },
            })
          }
          className="flex-1 h-[52px] rounded-xl items-center justify-center bg-[#45B310]"
        >
          <Text className="text-white text-lg font-medium">다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
