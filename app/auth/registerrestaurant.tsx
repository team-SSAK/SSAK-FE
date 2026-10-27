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
      style={{
        backgroundColor: selected ? "#E2E8F0" : "#F5F7FA",
        height: 120,
        padding: 16,
        borderRadius: 10,
        flexDirection: "row",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      {image ? (
        <Image
          source={image}
          style={{ width: 87, height: 87, borderRadius: 8 }}
          contentFit="cover"
        />
      ) : (
        <View style={{ width: 87, height: 87, borderRadius: 8, backgroundColor: "#E2E8F0" }} />
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{ color: "#0E172A", fontSize: 16, fontWeight: "600", lineHeight: 25.6 }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{ color: "#94A3B8", fontSize: 12, fontWeight: "600", lineHeight: 19.2 }}
          numberOfLines={2}
        >
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

  const { data: allRestaurants = [], isLoading, isError, refetch } = useRestaurant();

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
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", paddingTop: 56 }}>
      {/* 헤더 */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 18, flexDirection: "row", gap: 8, alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft />
        </TouchableOpacity>
        <Text style={{ color: "#1E293B", fontSize: 20, fontWeight: "600", lineHeight: 32 }}>
          회원가입
        </Text>
      </View>

      {/* 타이틀 영역 */}
      <View style={{ paddingHorizontal: 16, paddingTop: 40, gap: 14 }}>
        <StepIndicator currentStep={4} totalSteps={5} />
        <Text style={{ color: "#001402", fontSize: 24, fontWeight: "600", lineHeight: 38.4 }}>
          현재 운영중인 식당을 선택해주세요
        </Text>

        {/* 검색창 */}
        <View style={{ height: 58, justifyContent: "center" }}>
          <View
            style={{
              backgroundColor: "#F5F7FA",
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 8,
              gap: 10,
            }}
          >
            <RNTextInput
              placeholder="식당 이름을 검색해주세요"
              placeholderTextColor="#94A3B8"
              style={{ flex: 1, fontSize: 16, fontWeight: "500", color: "#0E172A" }}
              onChangeText={(text) => {
                setQuery(text);
                setSelectedId(null);
              }}
              value={query}
            />
            <Search width={24} height={24} />
          </View>
        </View>
      </View>

      {/* 목록 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 11, paddingBottom: 160 }}
      >
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 32 }} />
        ) : isError ? (
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 32, alignItems: "center" }}>
            <Text style={{ textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
              식당 목록을 불러오지 못했습니다{"\n"}탭해서 다시 시도
            </Text>
          </TouchableOpacity>
        ) : filtered.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#94A3B8", fontSize: 14, marginTop: 32 }}>
            {query ? "검색 결과가 없습니다" : "등록된 식당이 없습니다"}
          </Text>
        ) : (
          filtered.map((r) => (
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
          ))
        )}
      </ScrollView>

      {/* 하단 그라디언트 + 버튼 */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <View
          style={{ flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingVertical: 10 }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              height: 52,
              paddingHorizontal: 36,
              paddingVertical: 12,
              backgroundColor: "#F1F5F9",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#0E172A", fontSize: 18, fontWeight: "500", lineHeight: 28.8 }}>
              이전
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!isEnabled}
            onPress={() => setShowConfirm(true)}
            style={{
              flex: 1,
              height: 52,
              padding: 12,
              backgroundColor: isEnabled ? "#45B310" : "#94A3B8",
              opacity: isEnabled ? 1 : 0.5,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "500", lineHeight: 28.8 }}>
              완료
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 34 }} />
      </View>

      <AlertPopup
        visible={showConfirm}
        title={
          <Text style={{ color: "#1E293B", fontSize: 18, fontWeight: "600", lineHeight: 28.8 }}>
            <Text style={{ color: "#4ADE80" }}>'{selectedName}'</Text>의 사장님으로{"\n"}회원가입 할까요?
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
