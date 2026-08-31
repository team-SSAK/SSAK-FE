import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import LocationPermissionModal from "../../components/locationpermissionmodal";
import RestaurantLocationMap from "../../components/restaurant-location-map";
import { useRestaurant } from "../../src/hooks/useRestaurant";
import { getRestaurantById } from "../../src/services/home/restaurent.service";

const CAMPUS_CENTER = {
  latitude: 37.5615,
  longitude: 126.9466,
};

export default function LocationScreen() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [restaurantMarkers, setRestaurantMarkers] = useState<Array<{ id: number; latitude: number; longitude: number; title: string }>>([]);
  const { data: restaurants = [] } = useRestaurant();

  useEffect(() => {
    if (restaurants.length === 0) return;
    const fetchCoords = async () => {
      const results = await Promise.allSettled(
        restaurants.map((r) => getRestaurantById(r.restaurantId))
      );
      const markers: Array<{ id: number; latitude: number; longitude: number; title: string }> = [];
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          const d = result.value;
          const lat = Number(d?.latitude ?? d?.restaurantCoord?.y);
          const lon = Number(d?.longitude ?? d?.restaurantCoord?.x);
          if (Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0) {
            markers.push({
              id: restaurants[i].restaurantId,
              latitude: lat,
              longitude: lon,
              title: restaurants[i].restaurantName,
            });
          }
        }
      });
      setRestaurantMarkers(markers);
    };
    fetchCoords();
  }, [restaurants]);

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
