import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function DeleteAccount() {
  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-5">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-800 text-2xl font-semibold leading-10">
          계정을 삭제하시겠습니까?
        </Text>
        <View className="h-3" />
        <Text className="text-gray-500 text-sm font-medium leading-6">
          계정을 삭제하시면 다음 사항에 동의하는 것으로 간주합니다.
        </Text>
        <View className="h-7"></View>
        <View className="px-3.5 py-5 bg-gray-50 rounded-2xl flex-col justify-start items-start gap-2.5">
          <Text className="text-gray-800 text-sm font-medium leading-6">
            • 개인정보가 영구적으로 삭제됩니다.
          </Text>
          <Text className="text-gray-800 text-sm font-medium leading-6">
            • 이용 기간 동안의 포인트 이용 내역은 관련 볍룰 및 규정에 따라
            보존됩니다.
          </Text>
          <Text className="text-red-500 text-sm font-medium leading-6">
            • 보유 중인 포인트 및 쿠폰은 모두 삭제됩니다.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/mypage/deletereason")}
        className="self-stretch h-[52px] p-3 bg-[#45B310] rounded-xl flex-row justify-center items-center"
      >
        <Text className="flex-1 text-center text-white text-lg font-medium leading-7">
          확인
        </Text>
      </TouchableOpacity>
    </View>
  );
}
