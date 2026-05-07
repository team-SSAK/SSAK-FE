import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

import { useState } from "react";
import { usePoint, usePoints } from "../../src/hooks/usePoint";
import { PointOption } from "../../src/services/mypage/point.service";

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

const getDateKey = (pointTime: string | null): string | null => {
  if (typeof pointTime !== "string") {
    return null;
  }

  const date = new Date(pointTime);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toDateString();
};

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
  pointType: "SAVE" | "USE" | "REFUND";
  pointTime: string | null;
  showDate: boolean;
  currentPoint: number;
}

function PointHistoryItem({
  pointAmount,
  pointDesc,
  pointType,
  pointTime,
  showDate,
  currentPoint,
}: PointHistoryItemProps) {
  const hasValidTime =
    typeof pointTime === "string" &&
    !Number.isNaN(new Date(pointTime).getTime());
  const date = hasValidTime ? new Date(pointTime as string) : null;

  const formattedDate = date ? `${date.getMonth() + 1}.${date.getDate()}` : "";
  const formattedTime = date
    ? `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : "시간 정보 없음";

  const isPlus = pointType === "SAVE" || pointType === "REFUND";

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
            isPlus ? "text-green-400" : "text-gray-800"
          }`}
        >
          {isPlus ? "+" : "-"}
          {pointAmount}P
        </Text>
        <Text className="text-gray-500 text-xs font-medium leading-5 line-clamp-1">
          {currentPoint}P
        </Text>
      </View>
    </View>
  );
}

export default function Point() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("전체");
  const pointOption: PointOption | undefined =
    activeFilter === "적립"
      ? "SAVE"
      : activeFilter === "사용"
        ? "USE"
        : undefined;

  const { point, isLoading: isPointLoading } = usePoint();
  const { points, loading, isError } = usePoints(pointOption);
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
          {isPointLoading ? "..." : `${point ?? 0}P`}
        </Text>
      </View>

      <FilterChipGroup
        defaultFilter="전체"
        onChange={(filter) => setActiveFilter(filter)}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {loading && (
          <Text className="text-gray-500 text-sm font-medium px-4 py-3">
            포인트 내역을 불러오는 중...
          </Text>
        )}

        {!loading && isError && (
          <Text className="text-red-500 text-sm font-medium px-4 py-3">
            포인트 내역 조회에 실패했습니다.
          </Text>
        )}

        {points.map((item, index) => {
          const currentDate = getDateKey(item.pointTime);
          const prevDate =
            index > 0 ? getDateKey(points[index - 1].pointTime) : null;

          const showDate = currentDate !== null && currentDate !== prevDate;

          return (
            <PointHistoryItem
              key={item.pointHistId}
              pointAmount={item.pointAmount}
              pointDesc={item.pointDesc}
              pointType={item.pointType}
              pointTime={item.pointTime}
              showDate={showDate}
              currentPoint={point ?? 0}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
