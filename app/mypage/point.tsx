import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

import { useState } from "react";

import { usePoint } from "@/src/hooks/usePoint";

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
    <View className="self-stretch pt-6 pb-3 flex-col justify-start items-start gap-2.5">
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

interface PointHistoryItemProps {
  pointAmount: number;
  pointDesc: string;
  pointType: "SAVE" | "USE";
  pointTime: string;
  showDate: boolean; // ✅ 추가
}

function PointHistoryItem({
  pointAmount,
  pointDesc,
  pointType,
  pointTime,
  showDate,
}: PointHistoryItemProps) {
  const date = new Date(pointTime);

  const formattedDate = `${date.getMonth() + 1}.${date.getDate()}`;
  const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const isSave = pointType === "SAVE";

  return (
    <View className="flex-row justify-between p-4 border-b border-gray-100">
      {/* 날짜 */}
      <Text className="text-gray-500 text-sm font-medium leading-6 w-12">
        {showDate ? formattedDate : ""}
      </Text>

      {/* 설명 및 시간 */}
      <View className="flex-col pl-[42px] pr-6 flex-1">
        <Text className="text-gray-700 font-semibold leading-6">
          {pointDesc}
        </Text>
        <Text className="text-gray-500 text-xs font-medium leading-5">
          {formattedTime}
        </Text>
      </View>

      {/* 포인트 */}
      <View className="flex-col items-end">
        <Text
          className={`text-lg font-semibold leading-7 ${
            isSave ? "text-green-400" : "tex-gray-800"
          }`}
        >
          {isSave ? "+" : "-"}
          {pointAmount}P
        </Text>
      </View>
    </View>
  );
}

export default function Point() {
  const { point } = usePoint();
  const [activeFilter, setActiveFilter] = useState<FilterType>("전체");

  // mock 데이터 (API 대신 사용)
  const MOCK_POINT_HISTORIES = [
    {
      pointHistId: 1,
      pointAmount: 500,
      pointDesc: "신규 가입 축하 포인트",
      pointType: "SAVE",
      pointTime: "2026-02-14T15:25:52",
    },
    {
      pointHistId: 2,
      pointAmount: 100,
      pointDesc: "잔반 인증 완료 90%",
      pointType: "SAVE",
      pointTime: "2026-02-14T14:30:00",
    },
    {
      pointHistId: 3,
      pointAmount: 300,
      pointDesc: "쿠폰 사용",
      pointType: "USE",
      pointTime: "2026-02-16T18:10:12",
    },
  ];
  const filteredData = MOCK_POINT_HISTORIES.filter((item) => {
    if (activeFilter === "전체") return true;
    if (activeFilter === "적립") return item.pointType === "SAVE";
    if (activeFilter === "사용") return item.pointType === "USE";
  });
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
      {/* 내 포인트 */}
      <View className="flex flex-col gap-0.5 px-5 py-[26px] bg-gray-50 rounded-xl">
        <Text className="text-gray-500 font-semibold leading-6">내 포인트</Text>
        <Text className="text-gray-800 text-2xl font-bold leading-8">
          {point ?? 0}P
        </Text>
      </View>

      <FilterChipGroup
        defaultFilter="전체"
        onChange={(filter) => setActiveFilter(filter)}
      />

      {/* (추후 포인트 내역 들어갈 자리) */}
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {filteredData.map((item, index) => {
          const currentDate = new Date(item.pointTime).toDateString();
          const prevDate =
            index > 0
              ? new Date(filteredData[index - 1].pointTime).toDateString()
              : null;

          const showDate = currentDate !== prevDate;

          return (
            <PointHistoryItem
              key={item.pointHistId}
              pointAmount={item.pointAmount}
              pointDesc={item.pointDesc}
              pointType={item.pointType as "SAVE" | "USE"}
              pointTime={item.pointTime}
              showDate={showDate}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
