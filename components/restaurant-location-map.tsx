import { Text, View } from "react-native";

interface RestaurantMarker {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

interface RestaurantLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  restaurantMarkers?: RestaurantMarker[];
  userLocation?: { latitude: number; longitude: number };
}

export default function RestaurantLocationMap(_: RestaurantLocationMapProps) {
  return (
    <View className="flex-1 bg-gray-200 items-center justify-center">
      <Text className="text-gray-600 text-sm font-medium">
        지도는 모바일 앱에서 확인할 수 있어요.
      </Text>
    </View>
  );
}
