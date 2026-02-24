import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Avatar from "../../assets/images/avatar.svg";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import EditBtn from "../../assets/images/editbtn.svg";
import TextInput from "../../components/input/textinput";

const MAX_LENGTH = 8;

export default function FoundPWEmail() {
  const [inputValue, setInputValue] = useState("");
  const isButtonEnabled =
    inputValue.length >= 1 && inputValue.length <= MAX_LENGTH;

  const handleChangeText = (text: string) => {
    setInputValue(text);
  };

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
          <TouchableOpacity onPress={() => router.push("/auth/landing")}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
            프로필 수정
          </Text>
        </View>

        <View className="justify-center items-center mb-[11px]">
          <View className="relative w-40 h-40">
            <Avatar width={160} height={160} />
            <TouchableOpacity className="absolute bottom-0 right-0">
              <EditBtn />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-gray-800 text-sm font-semibold leading-6">
          닉네임
        </Text>
        <View className="h-2" />

        <TextInput
          placeholder="닉네임을 입력해주세요"
          value={inputValue}
          onChangeText={handleChangeText}
        />
        <Text className="text-right text-gray-500 text-sm font-medium leading-6">
          {inputValue.length}/{MAX_LENGTH}
        </Text>
      </View>

      <TouchableOpacity
        disabled={!isButtonEnabled}
        className={`self-stretch h-12 p-3 rounded-xl flex-row justify-center items-center ${
          isButtonEnabled ? "bg-[#45B310]" : "bg-slate-300"
        }`}
      >
        <Text className="flex-1 text-center text-white text-lg font-medium leading-7">
          완료
        </Text>
      </TouchableOpacity>
    </View>
  );
}
