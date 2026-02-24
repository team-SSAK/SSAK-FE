import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

import { useState } from "react";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

function FilterChip({ label, selected = false, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-1 rounded-full justify-center items-center ${
        selected ? "bg-gray-600" : "bg-gray-100"
      }`}
    >
      <Text
        className={`text-sm font-semibold leading-6 ${
          selected ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type FilterType = "전체" | "적립" | "사용";
const FILTERS: FilterType[] = ["전체", "적립", "사용"];

interface FilterChipGroupProps {
  defaultFilter?: FilterType;
  onChange?: (filter: FilterType) => void;
}

function FilterChipGroup({
  defaultFilter = "전체",
  onChange,
}: FilterChipGroupProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(defaultFilter);

  const handlePress = (filter: FilterType) => {
    setActiveFilter(filter);
    onChange?.(filter);
  };

  return (
    <View className="self-stretch pt-6 flex-col justify-start items-start gap-2.5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, alignItems: "center" }}
      >
        {FILTERS.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            selected={activeFilter === filter}
            onPress={() => handlePress(filter)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default function Point() {
  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      {/* 헤더 */}
      <View className="py-4 flex-row gap-2 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft />
        </TouchableOpacity>
        <Text className="text-gray-800 text-xl font-semibold">
          포인트 사용 내역
        </Text>
      </View>
      <View className="flex flex-col gap-0.5 px-5 py-[26px] bg-gray-50 rounded-xl">
        <Text className="text-gray-500 font-semibold leading-6">내 포인트</Text>
        <Text className="text-gray-800 text-2xl font-bold leading-8">
          342352P
        </Text>
      </View>

      <FilterChipGroup onChange={(filter) => console.log(filter)} />

      {/* 스크롤 */}
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 20,
          paddingBottom: 140,
          gap: 6,
        }}
      ></ScrollView>
    </View>
  );
}
