import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import { Toggle } from "../../components/toggle";

export default function Notification() {
  const [communityOn, setCommunityOn] = useState(false);
  const [eventOn, setEventOn] = useState(false);
  const [nightOn, setNightOn] = useState(false);

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-7">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">알림 설정</Text>
        </View>

        <View className="flex flex-col gap-2.5">
          <Text className="text-gray-800 font-semibold">서비스 알림</Text>

          <View className="flex flex-row justify-between py-3.5 px-4 bg-gray-50 rounded-lg">
            <Text className="text-gray-700 font-medium">커뮤니티 알림</Text>
            <Toggle value={communityOn} onChange={setCommunityOn} />
          </View>

          <View className="h-[18px]" />

          <Text className="text-gray-800 font-semibold">마케팅 정보 수신</Text>

          <View className="self-stretch h-14 px-4 py-3.5 bg-gray-50 rounded-tl-lg rounded-tr-lg flex-row justify-start items-center gap-2.5">
            <Text className="flex-1 text-gray-700 font-medium leading-6">
              이벤트 및 혜택 알림
            </Text>
            <Toggle value={eventOn} onChange={setEventOn} />
          </View>

          <View className="flex flex-row justify-between py-3.5 px-4 bg-gray-50 rounded-lg">
            <Text className="text-gray-700 font-medium">
              야간 혜택 알림 (21시~8시)
            </Text>
            <Toggle value={nightOn} onChange={setNightOn} />
          </View>
        </View>
      </View>
    </View>
  );
}
