import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";

interface ResCardProps {
  name?: string;
  address?: string;
  image?: string;
  selected?: boolean;
  onToggle?: () => void;
}

function ResCard({
  name = "이화여자대학교 EHOUSE",
  address = "서울특별시 서초구 반포대로 118",
  image,
  selected = false,
  onToggle,
}: ResCardProps) {
  return (
    <View className="self-stretch p-4 bg-slate-100 rounded-[10px] flex-col justify-start items-start">
      <View className="self-stretch flex-row justify-start items-start gap-4">
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-20 h-20 rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="w-20 h-20 rounded-lg bg-slate-200" />
        )}

        <View className="flex-1 self-stretch flex-col justify-start items-start gap-0.5">
          <Text
            className="self-stretch text-slate-900 text-base font-semibold leading-6"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            className="self-stretch text-slate-400 text-xs font-semibold leading-5"
            numberOfLines={2}
          >
            {address}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onToggle}
          className="w-7 h-7 justify-start items-end"
        >
          {selected ? <HeartFilled /> : <Heart />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface RestaurantItem {
  id: number;
  name: string;
  address: string;
  image?: string;
}

const RESTAURANTS: RestaurantItem[] = [
  {
    id: 0,
    name: "이화여자대학교 EHOUSE",
    address: "서울특별시 서초구 반포대로 118",
  },
  {
    id: 1,
    name: "스타벅스 신촌점",
    address: "서울특별시 서대문구 신촌로 83",
  },
  {
    id: 2,
    name: "맥도날드 홍대입구점",
    address: "서울특별시 마포구 양화로 188",
  },
  {
    id: 3,
    name: "올리브영 강남본점",
    address: "서울특별시 강남구 강남대로 396",
  },
];

export default function Restaurant() {
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    Record<number, boolean>
  >({});

  const toggle = (id: number) => {
    setSelectedRestaurants((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      {/* 헤더 */}
      <View className="py-4 flex-row gap-2 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft />
        </TouchableOpacity>
        <Text className="text-gray-800 text-xl font-semibold">내 식당</Text>
      </View>

      {/* 스크롤 */}
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 20,
          paddingBottom: 140,
          gap: 6,
        }}
      >
        {RESTAURANTS.map((restaurant) => (
          <ResCard
            key={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            image={restaurant.image}
            selected={!!selectedRestaurants[restaurant.id]}
            onToggle={() => toggle(restaurant.id)}
          />
        ))}
      </ScrollView>

      {/* 하단 그라디언트 오버레이 */}
      <View className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        <View className="flex-1 bg-gradient-to-b from-white/0 to-white/90" />
      </View>
    </View>
  );
}
