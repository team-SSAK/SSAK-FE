import StepIndicator from "@/components/stepindicator";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import Search from "../../assets/images/search.svg";
import AlertPopup from "../../components/alertpopup";

type MockRestaurant = {
  id: number;
  name: string;
  address: string;
  image: string;
};

const MOCK_RESTAURANTS: MockRestaurant[] = [
  {
    id: 1,
    name: "싹싹한식당",
    address: "서울시 강남구 테헤란로 123",
    image: "https://picsum.photos/seed/ssak-1/160/160",
  },
  {
    id: 2,
    name: "그린키친",
    address: "서울시 송파구 올림픽로 55",
    image: "https://picsum.photos/seed/ssak-2/160/160",
  },
  {
    id: 3,
    name: "바른도시락",
    address: "서울시 마포구 월드컵북로 88",
    image: "https://picsum.photos/seed/ssak-3/160/160",
  },
];

interface MockRestaurantCardProps {
  item: MockRestaurant;
  selected: boolean;
  onPress: () => void;
}

function MockRestaurantCard({
  item,
  selected,
  onPress,
}: MockRestaurantCardProps) {
  return (
    <View
      className={`self-stretch h-28 p-4 rounded-[10px] flex-col justify-start items-start ${selected ? "bg-slate-200" : "bg-slate-100"}`}
    >
      <View className="self-stretch flex-row justify-start items-start gap-4">
        <TouchableOpacity
          onPress={onPress}
          className="flex-1 flex-row gap-4"
          activeOpacity={0.8}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
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
              {item.name}
            </Text>
            <Text
              className="text-slate-400 text-xs font-semibold"
              numberOfLines={2}
            >
              {item.address}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RegisterRestaurant() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [restaurants, setRestaurants] = useState<MockRestaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    number | null
  >(null);
  const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);

  const isButtonEnabled = selectedRestaurantId !== null;

  useLocalSearchParams<{
    email: string;
    password: string;
  }>();

  const handleSearchTextChange = (text: string) => {
    setName(text);
    setSelectedRestaurantId(null);
  };

  const selectedRestaurantName =
    restaurants.find((item) => item.id === selectedRestaurantId)?.name ?? name;

  useEffect(() => {
    const keyword = name.trim().toLowerCase();

    if (!keyword) {
      setHasSearched(false);
      setRestaurants([]);
      setIsLoading(false);
      return;
    }

    setHasSearched(true);
    setIsLoading(true);

    // 실시간 검색처럼 보이도록 짧은 지연 후 결과를 반영한다.
    const timer = setTimeout(() => {
      const next = MOCK_RESTAURANTS.filter((item) =>
        `${item.name} ${item.address}`.toLowerCase().includes(keyword),
      );

      setRestaurants(next);
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [name]);

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
          <TouchableOpacity onPress={() => router.push("/auth/landing")}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
            회원가입
          </Text>
        </View>
        <StepIndicator currentStep={3} />
        <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
          현재 운영중인 식당을 선택해주세요
        </Text>
        <View className="w-full relative">
          <View className="self-stretch p-4 bg-gray-100 rounded-lg justify-start">
            <RNTextInput
              placeholder="식당 이름을 검색해주세요"
              placeholderTextColor="#6B7280"
              className="text-gray-900 font-medium leading-6 pr-8"
              onChangeText={handleSearchTextChange}
              value={name}
            />
          </View>
          <View className="absolute right-4 top-0 bottom-0 justify-center pointer-events-none">
            <Search width={20} height={20} />
          </View>
        </View>

        <View className="mt-[10px] gap-2">
          {hasSearched && !isLoading && restaurants.length > 0
            ? restaurants.map((item) => (
                <MockRestaurantCard
                  key={item.id}
                  item={item}
                  selected={selectedRestaurantId === item.id}
                  onPress={() => {
                    if (selectedRestaurantId === item.id) {
                      setSelectedRestaurantId(null);
                      setName("");
                      return;
                    }

                    setSelectedRestaurantId(item.id);
                    setName(item.name);
                  }}
                />
              ))
            : null}
        </View>
      </View>

      <View className="w-full flex-row gap-2.5 px-4 py-2.5">
        {/* 이전: 고정폭 */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-[52px] px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        {/* 다음: flex-1 */}
        <TouchableOpacity
          disabled={!isButtonEnabled}
          className="flex-1 h-[52px] rounded-xl items-center justify-center"
          style={{
            backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
            opacity: isButtonEnabled ? 1 : 0.5,
          }}
          onPress={() => setIsConfirmPopupVisible(true)}
        >
          <Text className="text-white text-lg font-medium">완료</Text>
        </TouchableOpacity>
      </View>

      <AlertPopup
        visible={isConfirmPopupVisible}
        title={
          <Text className="text-slate-800 text-lg font-semibold leading-7">
            <Text className="text-green-400">
              {"'"}
              {selectedRestaurantName}
              {"'"}
            </Text>
            의 사장님으로 회원가입 할까요 ?
          </Text>
        }
        description="현재 운영 중인 식당만 가입할 수 있어요"
        cancelText="취소"
        confirmText="네"
        onCancel={() => setIsConfirmPopupVisible(false)}
        onConfirm={() => {
          setIsConfirmPopupVisible(false);
          router.replace("/auth/landing");
        }}
      />
    </View>
  );
}
