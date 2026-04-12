import { Text, View } from "react-native";
export default function AnouncementCard() {
  return (
    <View className="py-3.5 border-b border-gray-50">
      <Text className="font-medium text-base leading-6">
        [신규 쿠폰] 신규 쿠폰이 업데이트 안내
      </Text>
      <Text className="text-gray-500 text-xs font-medium leading-5">
        2026.03.13
      </Text>
    </View>
  );
}
