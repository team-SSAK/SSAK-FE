import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import { MOCK_COUPONS } from "../../constants/mock-data";

interface CouponCardProps {
  storeName?: string;
  title?: string;
  price?: string;
  selected?: boolean;
  used?: boolean;
  image?: string;
  onToggle?: () => void;
  onPress?: () => void;
}

const CouponCard = ({
  storeName = "가게이름",
  title = "GS25 새콤달콤 포도맛 15% 할인 쿠폰",
  price = "200P",
  selected = false,
  used = false,
  image,
  onToggle,
  onPress,
}: CouponCardProps) => {
  return (
    <TouchableOpacity
      className="flex-col gap-2.5 w-full"
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View
        className="relative w-full rounded-md bg-slate-100 overflow-hidden"
        style={{ aspectRatio: 1 }}
      >
        {image ? (
          <Image
            source={image}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            contentPosition="center"
          />
        ) : null}

        {used && (
          <View className="absolute inset-0 rounded-md bg-white/40 justify-center items-center">
            <View className="w-16 p-3 bg-black/50 rounded-full items-center justify-center gap-2.5">
              <Text className="text-white text-lg font-bold text-center leading-5">
                {"사용\n완료"}
              </Text>
            </View>
          </View>
        )}

        {!used && (
          <TouchableOpacity
            className="absolute right-3.5 bottom-3.5"
            onPress={onToggle}
          >
            {selected ? <HeartFilled /> : <Heart />}
          </TouchableOpacity>
        )}
      </View>

      <View className="w-full">
        <Text className="text-slate-500 text-xs font-semibold leading-5">
          {storeName}
        </Text>
        <Text
          className="text-slate-500 text-sm font-semibold leading-6 h-12"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="text-slate-900 text-lg font-bold leading-6">
          {price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

type TabType = "사용 가능" | "사용 완료" | "찜한 쿠폰";
const TABS: TabType[] = ["사용 가능", "사용 완료", "찜한 쿠폰"];

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <View className="flex-row">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            className={`flex-1 p-2.5 justify-center items-center border-b ${
              isActive ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                isActive ? "text-slate-800" : "text-slate-300"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface CouponItem {
  id: number;
  used: boolean;
  wished?: boolean;
  storeName: string;
  title: string;
  price: string;
  image?: string;
}

const EMPTY_MESSAGES: Record<TabType, string> = {
  "사용 가능": "사용 가능한 쿠폰이 없습니다",
  "사용 완료": "사용 완료된 쿠폰이 없습니다",
  "찜한 쿠폰": "찜한 쿠폰이 없습니다",
};

export default function Coupon() {
  const [activeTab, setActiveTab] = useState<TabType>("사용 가능");
  const [selectedCoupons, setSelectedCoupons] = useState<
    Record<number, boolean>
  >({});
  const coupons: CouponItem[] = MOCK_COUPONS;
  const filteredCoupons = coupons.filter((coupon) => {
    if (activeTab === "사용 가능") return !coupon.used;
    if (activeTab === "사용 완료") return coupon.used;
    return !!coupon.wished;
  });

  const toggle = (id: number) => {
    setSelectedCoupons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      {/* 헤더 */}
      <View className="py-4 flex-row gap-2 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft />
        </TouchableOpacity>
        <Text className="text-gray-800 text-xl font-semibold">내 쿠폰</Text>
      </View>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 스크롤 */}
      <ScrollView
        contentContainerStyle={{ paddingVertical: 42, paddingBottom: 140 }}
      >
        {filteredCoupons.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-slate-300 text-base font-semibold">
              {EMPTY_MESSAGES[activeTab]}
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-x-[14px] gap-y-[18px]">
            {filteredCoupons.map((coupon) => (
              <View key={coupon.id} className="w-[calc(50%-7px)]">
                <CouponCard
                  storeName={coupon.storeName}
                  title={coupon.title}
                  price={coupon.price}
                  used={coupon.used}
                  selected={!!selectedCoupons[coupon.id]}
                  image={coupon.image}
                  onToggle={() => toggle(coupon.id)}
                  onPress={() =>
                    router.push({
                      pathname: "/store/mycoupon",
                      params: {
                        couponId: String(coupon.id),
                        storeName: coupon.storeName,
                        title: coupon.title,
                        price: coupon.price,
                        image: coupon.image ?? "",
                      },
                    })
                  }
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 하단 그라디언트 오버레이 */}
      <View className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        <View className="flex-1 bg-gradient-to-b from-white/0 to-white/90" />
      </View>
    </View>
  );
}
