import TextInput from "@/components/input/textinput";
import StepIndicator from "@/components/stepindicator";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function RegisterName() {
  const [name, setName] = useState("");

  const isButtonEnabled = name.length > 0;

  const { email, password } = useLocalSearchParams<{
    email: string;
    password: string;
  }>();

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
        <StepIndicator currentStep={3} />
        <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
          사용할 닉네임을 입력해주세요
        </Text>
        <TextInput
          placeholder="사용할 닉네임을 입력해주세요"
          onChangeText={setName}
          value={name}
        />
        <Text className="w-full text-right justify-start text-gray-500 text-sm font-medium leading-6">
          {name.length}/8
        </Text>
      </View>

      <View className="w-full flex-row gap-2.5 px-4 py-2.5">
        {/* 이전: 고정폭 */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        {/* 다음: flex-1 */}
        <TouchableOpacity
          disabled={!isButtonEnabled}
          className="flex-1 h-12 rounded-xl items-center justify-center"
          style={{
            backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
            opacity: isButtonEnabled ? 1 : 0.5,
          }}
          onPress={() =>
            router.push({
              pathname: "/auth/registerdone",
              params: {
                email,
                password,
                name,
              },
            })
          }
        >
          <Text className="text-white text-lg font-medium">다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
