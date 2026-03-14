import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

import { useRestaurantWish } from "../../src/hooks/useRestaurantWish";

//////////////////////////////////////////////////////
// 타입
//////////////////////////////////////////////////////

interface RestaurantWishResponse {
  restaurantWishId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantImgUrl: string;
}

//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

export default function Menu() {
  const { data } = useRestaurantWish();
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();

  const restaurants = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item: RestaurantWishResponse) => ({
      id: item.restaurantId,
      name: item.restaurantName,
      address: item.restaurantLocation,
      image: item.restaurantImgUrl,
    }));
  }, [data]);

  const selectedRestaurantId =
    typeof restaurantId === "string" ? Number(restaurantId) : NaN;

  const selectedRestaurant = useMemo(
    () =>
      restaurants.find((restaurant) => restaurant.id === selectedRestaurantId),
    [restaurants, selectedRestaurantId],
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-[56px]">
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">메뉴 상세</Text>
        </View>

        <View className="pt-4 flex flex-col">
          <View className="self-start px-2.5 py-0.5 bg-green-300 rounded-md justify-center items-center mb-1 ">
            <Text className="text-white text-xs font-semibold leading-5">
              자율배식형
            </Text>
          </View>
          <Text className="justify-start text-gray-800 text-xl font-semibold leading-8">
            {selectedRestaurant?.name ?? "식당 정보"}
          </Text>
          <View className="flex flex-row mt-2.5 ">
            <View className="flex flex-col gap-1 mr-[19px]">
              <Text className="text-gray-500 text-sm font-semibold leading-6">
                위치
              </Text>
              <Text className="text-gray-500 text-sm font-semibold leading-6">
                운영시간
              </Text>
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-gray-600 text-sm font-semibold leading-6 line-clamp-2">
                {selectedRestaurant?.address ?? "식당 주소"}
              </Text>
              <Text className="text-gray-600 text-sm font-semibold leading-6 line-clamp-2">
                07:00 - 21:30
              </Text>
            </View>
          </View>
        </View>

        <View className="self-stretch pl-3 pr-16 pt-2.5 pb-4 bg-slate-100 rounded-[10px] flex-row justify-start items-start gap-2.5 mt-5">
          <View className="w-20 flex-col justify-start items-start gap-2">
            <Text className="self-stretch text-slate-800 text-sm font-semibold leading-6">
              조식
            </Text>
            <Text className="self-stretch text-slate-400 text-sm font-medium leading-6">
              돌솥 비빔밥 고추장 비빔밥 미역국 정식 제육볶음 기본 김밥
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
