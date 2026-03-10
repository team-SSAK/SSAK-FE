import AnouncementCard from "@/components/anouncementcard";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function Anouncement() {
  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-1">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
            공지사항
          </Text>
        </View>

        <View className="flex flex-col">
          <AnouncementCard />
        </View>
      </View>
    </View>
  );
}
