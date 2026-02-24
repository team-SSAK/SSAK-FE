import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function DeleteAccount() {
  const [selectedReasons, setSelectedReasons] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [loading, setLoading] = useState(false);

  const isButtonEnabled = selectedReasons.some(Boolean);

  const handleNext = () => {
    setLoading(true);
    router.push("/auth/landing?showPopup=true&type=delete");
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-5">
          <TouchableOpacity onPress={() => router.push("/auth/landing")}>
            <ChevronLeft />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-800 text-2xl font-semibold leading-10">
          탈퇴 사유를 선택해주세요.
        </Text>

        <View className="h-7" />

        <View className="flex-col justify-start items-start gap-[22px]">
          <TouchableOpacity
            onPress={() =>
              setSelectedReasons((prev) => {
                const newArr = [...prev];
                newArr[0] = !newArr[0];
                return newArr;
              })
            }
            className="flex-row gap-3 justify-start items-center"
          >
            {selectedReasons[0] ? (
              <View className="w-5 h-5 bg-white rounded-full border-[6px] border-green-400" />
            ) : (
              <View className="w-5 h-5 bg-white rounded-full border border-gray-400" />
            )}
            <Text className="text-center justify-start text-gray-800 font-medium leading-6">
              쿠폰 가격이 너무 비싸요
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setSelectedReasons((prev) => {
                const newArr = [...prev];
                newArr[1] = !newArr[1];
                return newArr;
              })
            }
            className="flex-row gap-3 justify-start items-center"
          >
            {selectedReasons[1] ? (
              <View className="w-5 h-5 bg-white rounded-full border-[6px] border-green-400" />
            ) : (
              <View className="w-5 h-5 bg-white rounded-full border border-gray-400" />
            )}
            <Text className="text-center justify-start text-gray-800 font-medium leading-6">
              쿠폰 상품이 마음에 들지 않아요
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setSelectedReasons((prev) => {
                const newArr = [...prev];
                newArr[2] = !newArr[2];
                return newArr;
              })
            }
            className="flex-row gap-3 justify-start items-center"
          >
            {selectedReasons[2] ? (
              <View className="w-5 h-5 bg-white rounded-full border-[6px] border-green-400" />
            ) : (
              <View className="w-5 h-5 bg-white rounded-full border border-gray-400" />
            )}
            <Text className="text-center justify-start text-gray-800 font-medium leading-6">
              시스템 오류가 자주 발생해요
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setSelectedReasons((prev) => {
                const newArr = [...prev];
                newArr[3] = !newArr[3];
                return newArr;
              })
            }
            className="flex-row gap-3 justify-start items-center"
          >
            {selectedReasons[3] ? (
              <View className="w-5 h-5 bg-white rounded-full border-[6px] border-green-400" />
            ) : (
              <View className="w-5 h-5 bg-white rounded-full border border-gray-400" />
            )}
            <Text className="text-center justify-start text-gray-800 font-medium leading-6">
              잔반 인증 방식이 번거로워요
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setSelectedReasons((prev) => {
                const newArr = [...prev];
                newArr[4] = !newArr[4];
                return newArr;
              })
            }
            className="flex-row gap-3 justify-start items-center"
          >
            {selectedReasons[4] ? (
              <View className="w-5 h-5 bg-white rounded-full border-[6px] border-green-400" />
            ) : (
              <View className="w-5 h-5 bg-white rounded-full border border-gray-400" />
            )}
            <Text className="text-center justify-start text-gray-800 font-medium leading-6">
              자주 이용하지 않아요
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setSelectedReasons((prev) => {
                const newArr = [...prev];
                newArr[5] = !newArr[5];
                return newArr;
              })
            }
            className="flex-row gap-3 justify-start items-center"
          >
            {selectedReasons[5] ? (
              <View className="w-5 h-5 bg-white rounded-full border-[6px] border-green-400" />
            ) : (
              <View className="w-5 h-5 bg-white rounded-full border border-gray-400" />
            )}
            <Text className="text-center justify-start text-gray-800 font-medium leading-6">
              기타
            </Text>
          </TouchableOpacity>
        </View>
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
            <Text className="text-white text-lg font-medium">탈퇴하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
