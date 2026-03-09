import { Text, View } from "react-native";
import Home from "../assets/images/home.svg";
import Star from "../assets/images/star.svg";
import User from "../assets/images/user.svg";

export function BottomNav() {
  return (
    <View className="absolute bottom-0 left-0 right-0 h-20 pb-4 bg-white flex-row justify-around items-center shadow-[0_-1px_10px_rgba(198,198,198,0.25)]">
      <View className="items-center">
        <Home width={24} height={24} />
        <Text className="text-gray-500 text-xs">홈</Text>
      </View>
      <View className="items-center">
        <Star width={24} height={24} />
        <Text className="text-gray-500 text-xs">스토어</Text>
      </View>
      <View className="items-center">
        <User width={24} height={24} />
        <Text className="text-gray-500 text-xs">마이페이지</Text>
      </View>
    </View>
  );
}
