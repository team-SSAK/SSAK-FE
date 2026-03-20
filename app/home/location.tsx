import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function Loacation() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-[56px]">
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">내 위치</Text>
        </View>

        <View
          className="flex-1 bg-gray-400"
          style={{ marginHorizontal: -16 }}
        />
      </View>
    </View>
  );
}
