import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import RestaurantLocationMap from "../../components/restaurant-location-map";

const DEFAULT_PIN_COORD = {
  latitude: 37.5665,
  longitude: 126.978,
};

export default function Loacation() {
  const [coord, setCoord] = useState(DEFAULT_PIN_COORD);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setCoord({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);
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

        <View className="flex-1" style={{ marginHorizontal: -16 }}>
          <RestaurantLocationMap
            latitude={coord.latitude}
            longitude={coord.longitude}
            title="내 위치"
            description="현재 위치 기준"
          />
        </View>
      </View>
    </View>
  );
}
