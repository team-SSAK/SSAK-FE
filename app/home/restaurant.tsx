import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";

import { mockrestaurent } from "../../components/mockrestaurent";
import SearchInput from "../../components/searchinput";
import {
  usePostRestaurantWish,
  useRestaurant,
} from "../../src/hooks/useRestaurant";
import { getRestaurantById } from "../../src/services/home/restaurent.service";

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

//////////////////////////////////////////////////////
// 타입
//////////////////////////////////////////////////////

interface ResCardProps {
  name?: string;
  address?: string;
  image?: string;
  selected?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
}

//////////////////////////////////////////////////////
// 카드 컴포넌트
//////////////////////////////////////////////////////

function ResCard({
  name,
  address,
  image,
  selected = true,
  onToggle,
  onPress,
}: ResCardProps) {
  return (
    <View className="self-stretch p-4 bg-slate-100 rounded-[10px] flex-col">
      <View className="flex-row gap-4">
        <TouchableOpacity
          onPress={onPress}
          className="flex-1 flex-row gap-4"
          activeOpacity={0.8}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-lg bg-slate-200" />
          )}

          <View className="flex-1 flex-col gap-0.5">
            <Text
              className="text-slate-900 text-base font-semibold"
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              className="text-slate-400 text-xs font-semibold"
              numberOfLines={2}
            >
              {address}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onToggle} className="w-7 h-7 items-end">
          {selected ? <HeartFilled /> : <Heart />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const normalizeSearchText = (text: string) =>
  text.replace(/\s+/g, "").toLowerCase();

const isMatchedKeyword = (text: string, keyword: string) => {
  const normalizedText = normalizeSearchText(text);
  const normalizedKeyword = normalizeSearchText(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  return normalizedText.includes(normalizedKeyword);
};

//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

export default function Restaurant() {
  const [activeTab, setActiveTab] = useState<"nearby" | "my">("nearby");
  const [searchText, setSearchText] = useState("");
  const { data = [] } = useRestaurant();
  const { mutateAsync: postRestaurantWish } = usePostRestaurantWish();
  const [coordsMap, setCoordsMap] = useState<
    Record<number, { lat: number; lon: number }>
  >({});
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status === "granted") {
  //       const loc = await Location.getCurrentPositionAsync({});
  //       setUserLocation({
  //         lat: loc.coords.latitude,
  //         lon: loc.coords.longitude,
  //       });
  //     }
  //   })();
  // }, []);

  const restaurants = useMemo(() => {
    const source = data.length === 0 ? mockrestaurent : data;

    return source.map((item) => ({
      id: item.restaurantId,
      name: item.restaurantName,
      address: item.restaurantLocation,
      image: item.restaurantImgUrl,
      type: item.restaurantType ?? null,
      wished: item.wished,
    }));
  }, [data]);

  // 식당 좌표 일괄 fetch
  useEffect(() => {
    if (restaurants.length === 0) return;
    const fetchCoords = async () => {
      const results = await Promise.allSettled(
        restaurants.map((r) => getRestaurantById(r.id)),
      );
      const map: Record<number, { lat: number; lon: number }> = {};
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          const coord = result.value?.restaurantCoord;
          if (
            coord &&
            typeof coord.x === "number" &&
            typeof coord.y === "number"
          ) {
            // JTS Point: x = 경도(longitude), y = 위도(latitude)
            map[restaurants[i].id] = { lat: coord.y, lon: coord.x };
            return;
          }

          const lat = Number(result.value?.latitude ?? result.value?.lat);
          const lon = Number(
            result.value?.longitude ?? result.value?.lng ?? result.value?.lon,
          );

          if (Number.isFinite(lat) && Number.isFinite(lon)) {
            map[restaurants[i].id] = { lat, lon };
          }
        }
      });
      setCoordsMap(map);
    };
    fetchCoords();
  }, [restaurants]);

  // 기본값: 전부 채워진 하트
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    if (restaurants.length > 0) {
      const initialState = Object.fromEntries(
        restaurants.map((r) => [r.id, r.wished]),
      );
      setSelectedRestaurants(initialState);
    }
  }, [restaurants]);

  const toggle = async (id: number) => {
    const currentSelected =
      selectedRestaurants[id] ??
      restaurants.find((restaurant) => restaurant.id === id)?.wished ??
      false;
    const nextSelected = !currentSelected;

    setSelectedRestaurants((prev) => ({
      ...prev,
      [id]: nextSelected,
    }));

    try {
      await postRestaurantWish(id);
    } catch (error) {
      console.error("식당 찜하기 실패:", error);

      setSelectedRestaurants((prev) => ({
        ...prev,
        [id]: currentSelected,
      }));
    }
  };

  const tabRestaurants = useMemo(() => {
    if (activeTab === "nearby") {
      if (!userLocation) return restaurants;
      return [...restaurants].sort((a, b) => {
        const coordA = coordsMap[a.id];
        const coordB = coordsMap[b.id];
        if (!coordA && !coordB) return 0;
        if (!coordA) return 1;
        if (!coordB) return -1;
        const distA = haversineDistance(
          userLocation.lat,
          userLocation.lon,
          coordA.lat,
          coordA.lon,
        );
        const distB = haversineDistance(
          userLocation.lat,
          userLocation.lon,
          coordB.lat,
          coordB.lon,
        );
        return distA - distB;
      });
    }

    return restaurants.filter((restaurant) => {
      const isMyRestaurant =
        selectedRestaurants[restaurant.id] ?? restaurant.wished;

      return isMyRestaurant;
    });
  }, [activeTab, restaurants, selectedRestaurants, coordsMap, userLocation]);

  const filteredRestaurants = useMemo(() => {
    return tabRestaurants.filter(
      (restaurant) =>
        isMatchedKeyword(restaurant.name, searchText) ||
        isMatchedKeyword(restaurant.address, searchText),
    );
  }, [searchText, tabRestaurants]);

  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      {/* 헤더 */}
      <View className="flex flex-row justify-between items-center">
        <View className="py-4 flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">
            식당 선택하기
          </Text>
        </View>
        {/*
        <TouchableOpacity onPress={() => router.push("/home/location")}> 
          <Map />
        </TouchableOpacity>
        */}
      </View>

      <SearchInput
        placeholder="식당을 검색해주세요."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View
        className="flex flex-row gap-1.5 items-center"
        style={{ marginTop: 16, marginBottom: 10 }}
      >
        <TouchableOpacity onPress={() => setActiveTab("nearby")}>
          <Text
            className={`p-2 text-sm font-semibold leading-6 ${activeTab === "nearby" ? "text-gray-900" : "text-gray-400"}`}
          >
            가까운 식당
          </Text>
        </TouchableOpacity>
        <View className="w-[1.8px] h-3 bg-gray-400 rounded-full" />
        <TouchableOpacity onPress={() => setActiveTab("my")}>
          <Text
            className={`p-2 text-sm font-semibold leading-6 ${activeTab === "my" ? "text-gray-900" : "text-gray-400"}`}
          >
            내 식당
          </Text>
        </TouchableOpacity>
      </View>

      {/* 내용 */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 140,
          gap: 10,
        }}
      >
        {filteredRestaurants.map((restaurant) => (
          <ResCard
            key={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            image={restaurant.image}
            selected={!!selectedRestaurants[restaurant.id]}
            onToggle={() => {
              void toggle(restaurant.id);
            }}
            onPress={() =>
              router.push({
                pathname: "/home/restaurantdetail",
                params: {
                  restaurantId: String(restaurant.id),
                },
              })
            }
          />
        ))}
      </ScrollView>

      {/* 하단 그라디언트 */}
      <View className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        <View className="flex-1 bg-gradient-to-b from-white/0 to-white/90" />
      </View>
    </View>
  );
}
