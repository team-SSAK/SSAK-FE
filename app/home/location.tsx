import * as Location from "expo-location";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import LocationPermissionModal from "../../components/locationpermissionmodal";
import RestaurantLocationMap from "../../components/restaurant-location-map";
import { useRestaurant } from "../../src/hooks/useRestaurant";

const CAMPUS_CENTER = {
  latitude: 37.5615,
  longitude: 126.9466,
};

export default function LocationScreen() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { data: restaurants = [] } = useRestaurant();

  const restaurantMarkers = useMemo(() =>
    restaurants
      .filter((r) => r.latitude !== null && r.longitude !== null)
      .map((r) => ({
        id: r.restaurantId,
        latitude: r.latitude as number,
        longitude: r.longitude as number,
        title: r.restaurantName,
      })),
    [restaurants],
  );

  const handleCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setShowLocationModal(true);
      return;
    }
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setUserLocation({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-[56px]">
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center justify-between">
          <View className="flex-row gap-2 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft />
            </TouchableOpacity>
            <Text className="text-gray-800 text-xl font-semibold">내 위치</Text>
          </View>
          <TouchableOpacity
            onPress={handleCurrentLocation}
            className="px-3 py-1.5 bg-green-400 rounded-lg"
          >
            <Text className="text-white text-sm font-semibold">현재 위치</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1" style={{ marginHorizontal: -16 }}>
          <RestaurantLocationMap
            latitude={userLocation?.latitude ?? CAMPUS_CENTER.latitude}
            longitude={userLocation?.longitude ?? CAMPUS_CENTER.longitude}
            title={userLocation ? "내 위치" : "캠퍼스 중심"}
            description={userLocation ? "현재 위치" : "기본 위치"}
            restaurantMarkers={restaurantMarkers}
            userLocation={userLocation ?? undefined}
          />
        </View>
      </View>

      <LocationPermissionModal
        visible={showLocationModal}
        onCancel={() => setShowLocationModal(false)}
      />
    </View>
  );
}
