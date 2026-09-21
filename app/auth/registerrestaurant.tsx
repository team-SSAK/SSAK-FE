import StepIndicator from "@/components/stepindicator";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import Search from "../../assets/images/search.svg";
import AlertPopup from "../../components/alertpopup";
import { useRestaurant } from "../../src/hooks/useRestaurant";

interface RestaurantCardProps {
  name: string;
  address: string;
  image?: string;
  selected: boolean;
  onPress: () => void;
}

function RestaurantCard({ name, address, image, selected, onPress }: RestaurantCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`self-stretch p-4 rounded-[10px] flex-row gap-4 items-center ${selected ? "bg-slate-200" : "bg-slate-100"}`}
    >
      {image ? (
        <Image
          source={image}
          style={{ width: 80, height: 80, borderRadius: 8 }}
          contentFit="cover"
        />
      ) : (
        <View className="w-20 h-20 rounded-lg bg-slate-300" />
      )}
      <View className="flex-1">
        <Text className="text-slate-900 text-base font-semibold" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-slate-400 text-xs font-semibold mt-0.5" numberOfLines={2}>
          {address}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function RegisterRestaurant() {
  const { email, password, name } = useLocalSearchParams<{
    email: string;
    password: string;
    name: string;
  }>();

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: allRestaurants = [], isLoading } = useRestaurant();

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return allRestaurants;
    return allRestaurants.filter(
      (r) =>
        r.restaurantName.toLowerCase().includes(keyword) ||
        r.restaurantLocation.toLowerCase().includes(keyword),
    );
  }, [query, allRestaurants]);

  const selectedName =
    allRestaurants.find((r) => r.restaurantId === selectedId)?.restaurantName ?? query;

  const isEnabled = selectedId !== null;

  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft />
        </TouchableOpacity>
        <Text className="text-gray-800 text-xl font-semibold leading-8">회원가입</Text>
      </View>

      <StepIndicator currentStep={4} totalSteps={5} />

      <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
        현재 운영중인 식당을 선택해주세요
      </Text>

      {/* 검색 */}
      <View className="w-full relative mb-3">
        <View className="self-stretch p-4 bg-gray-100 rounded-lg">
          <RNTextInput
            placeholder="식당 이름을 검색해주세요"
            placeholderTextColor="#6B7280"
            className="text-gray-900 font-medium leading-6 pr-8"
            onChangeText={(text) => {
              setQuery(text);
              setSelectedId(null);
            }}
            value={query}
          />
        </View>
        <View className="absolute right-4 top-0 bottom-0 justify-center">
          <Search width={20} height={20} />
        </View>
      </View>

      {/* 목록 */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {isLoading ? (
          <ActivityIndicator className="mt-8" />
        ) : filtered.length === 0 ? (
          <Text className="text-center text-slate-400 text-sm mt-8">
            {query ? "검색 결과가 없습니다" : "등록된 식당이 없습니다"}
          </Text>
        ) : (
          <View className="gap-2">
            {filtered.map((r) => (
              <RestaurantCard
                key={r.restaurantId}
                name={r.restaurantName}
                address={r.restaurantLocation}
                image={r.restaurantImgUrl || undefined}
                selected={selectedId === r.restaurantId}
                onPress={() => {
                  if (selectedId === r.restaurantId) {
                    setSelectedId(null);
                    setQuery("");
                  } else {
                    setSelectedId(r.restaurantId);
                    setQuery(r.restaurantName);
                  }
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View className="flex-row gap-2.5 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-[52px] px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isEnabled}
          className="flex-1 h-[52px] rounded-xl items-center justify-center"
          style={{ backgroundColor: isEnabled ? "#45B310" : "#94A3B8", opacity: isEnabled ? 1 : 0.5 }}
          onPress={() => setShowConfirm(true)}
        >
          <Text className="text-white text-lg font-medium">완료</Text>
        </TouchableOpacity>
      </View>

      <AlertPopup
        visible={showConfirm}
        title={
          <Text className="text-slate-800 text-lg font-semibold leading-7">
            <Text className="text-green-400">'{selectedName}'</Text>의 사장님으로{"\n"}회원가입 할까요?
          </Text>
        }
        description="현재 운영 중인 식당만 가입할 수 있어요"
        cancelText="취소"
        confirmText="네"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          router.push({
            pathname: "/auth/registerdone",
            params: {
              email,
              password,
              name,
              restaurantId: String(selectedId),
              isOwner: "true",
            },
          });
        }}
      />
    </View>
  );
}
