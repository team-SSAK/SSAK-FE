import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import { MOCK_RESTAURANTS } from "../../constants/mock-data";

export default function Menu() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const selectedRestaurant =
    MOCK_RESTAURANTS.find(
      (restaurant) => String(restaurant.id) === String(restaurantId ?? ""),
    ) ?? MOCK_RESTAURANTS[0];

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
            {selectedRestaurant.name}
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
                {selectedRestaurant.address}
              </Text>
              <Text className="text-gray-600 text-sm font-semibold leading-6 line-clamp-2">
                {selectedRestaurant.hours}
              </Text>
            </View>
          </View>
        </View>

        <View className="self-stretch pl-3 pr-16 pt-2.5 pb-4 bg-slate-100 rounded-[10px] flex-row justify-start items-start gap-2.5 mt-5">
          <View className="w-20 flex-col justify-start items-start gap-2">
            <Text className="self-stretch text-slate-800 text-sm font-semibold leading-6">
              {selectedRestaurant.mealType}
            </Text>
            <Text className="self-stretch text-slate-400 text-sm font-medium leading-6">
              {selectedRestaurant.menu}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
