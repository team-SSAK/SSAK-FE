import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import AddBtn from "../../components/addbtn";
import { MOCK_RESTAURANTS } from "../../constants/mock-data";

interface ResCardProps {
  name?: string;
  address?: string;
  image?: string;
  selected?: boolean;
  onToggle?: () => void;
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
}: ResCardProps) {
  return (
    <View className="self-stretch p-4 bg-slate-100 rounded-[10px] flex-col">
      <View className="flex-row gap-4">
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

        <TouchableOpacity onPress={onToggle} className="w-7 h-7 items-end">
          {selected ? <HeartFilled /> : <Heart />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

//////////////////////////////////////////////////////
// 빈 메시지
//////////////////////////////////////////////////////

export default function Restaurant() {
  const restaurants = MOCK_RESTAURANTS;

  // 기본값: 전부 채워진 하트
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    Record<number, boolean>
  >(() =>
    Object.fromEntries(
      MOCK_RESTAURANTS.map((restaurant) => [restaurant.id, true]),
    ),
  );

  const toggle = (id: number) => {
    setSelectedRestaurants((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

      {/* 내용 */}
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 20,
          paddingBottom: 140,
          gap: 6,
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
          />
        ))}
      </ScrollView>

      {/* 하단 그라디언트 */}
      <View className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        <View className="flex-1 bg-gradient-to-b from-white/0 to-white/90" />
      </View>

      <View className="absolute bottom-[56px] right-4 z-10">
        <AddBtn onPress={() => router.push("/home/restaurant")} />
      </View>
    </View>
  );
}
