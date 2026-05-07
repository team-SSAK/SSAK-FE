import { Text, View } from "react-native";
export default function AnouncementCard() {
  return (
    <View className="py-3.5 border-b border-gray-50">
      <Text className="font-medium text-base leading-6">
        [업데이트] 싹 플랫폼 출시 안내
      </Text>
      <Text className="text-gray-500 text-xs font-medium leading-5">
        2026.05.07
      </Text>
    </View>
  );
}
