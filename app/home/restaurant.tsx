import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import Map from "../../assets/images/map.svg";

import { mockrestaurent } from "../../components/mockrestaurent";
import SearchInput from "../../components/searchinput";
import { MOCK_RESTAURANTS } from "../../constants/mock-data";

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

export default function Restaurant() {
  const restaurants = MOCK_RESTAURANTS;
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    Record<number, boolean>
  >(() =>
    Object.fromEntries(
      MOCK_RESTAURANTS.map((restaurant) => [restaurant.id, true]),
    ),
  );

  const toggle = (id: number) => {
    setSelectedRestaurants((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabRestaurants = useMemo(() => {
    if (activeTab === "nearby") {
      return restaurants;
    }

    return restaurants.filter((restaurant) => {
      const isMyRestaurant =
        selectedRestaurants[restaurant.id] ?? restaurant.wished;

      return isMyRestaurant;
    });
  }, [activeTab, restaurants, selectedRestaurants]);

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
        <TouchableOpacity onPress={() => router.push("/home/location")}>
          <Map />
        </TouchableOpacity>
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
        {restaurants.map((restaurant) => (
          <ResCard
            key={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            image={restaurant.image}
            selected={!!selectedRestaurants[restaurant.id]}
            onToggle={() => toggle(restaurant.id)}
            onPress={() =>
              router.push({
                pathname: "/home/restaurantdetail",
                params: { restaurantId: String(restaurant.id) },
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
