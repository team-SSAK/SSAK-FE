import TextInput from "@/components/input/textinput";
import StepIndicator from "@/components/stepindicator";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function RegisterEmail() {
  const [email, setEmail] = useState("");

  const isButtonEnabled = email.length > 0;

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
        <StepIndicator currentStep={0} />
        <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
          이메일을 입력해주세요
        </Text>
        <TextInput
          placeholder="이메일을 입력해주세요"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <TouchableOpacity
        onPress={() => router.push("/auth/registerverification")}
      >
        <View
          className="self-stretch p-3 rounded-xl justify-center items-center"
          style={{
            backgroundColor: isButtonEnabled ? "#45B310" : "#6B7280",
          }}
        >
          <Text className="text-center text-white text-lg font-medium leading-7">
            인증 요청
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
