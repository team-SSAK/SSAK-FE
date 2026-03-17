import AnouncementCard from "@/components/anouncementcard";
import { router } from "expo-router";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function Anouncement() {
  const ANNOUNCEMENT_URL =
    "https://www.notion.so/31fc1339dd7680e6add1d62805ab8dba?source=copy_link";

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
          <TouchableOpacity onPress={() => Linking.openURL(ANNOUNCEMENT_URL)}>
            <AnouncementCard />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
