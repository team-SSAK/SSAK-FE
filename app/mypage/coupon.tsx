import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import { getCoupons } from "../../src/services/mypage/coupons.service";

interface CouponCardProps {
  storeName?: string;
  title?: string;
  price?: string;
  selected?: boolean;
  used?: boolean;
  image?: string;
  onToggle?: () => void;
}

const CouponCard = ({
  storeName = "가게이름",
  title = "GS25 새콤달콤 포도맛 15% 할인 쿠폰",
  price = "200P",
  selected = false,
  used = false,
  image,
  onToggle,
}: CouponCardProps) => {
  return (
    <View className="flex-col gap-2.5 w-full">
      <View className="w-full aspect-square p-1 rounded-md bg-slate-100 justify-end items-end">
        {image ? (
          <Image
            source={{ uri: image }}
            className="absolute inset-0 w-full h-full rounded-md"
            resizeMode="cover"
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
          <TouchableOpacity className="m-3.5" onPress={onToggle}>
            {selected ? <HeartFilled /> : <Heart />}
          </TouchableOpacity>
        )}
      </View>

      <View className="w-full">
        <Text className="text-slate-500 text-xs font-semibold leading-5">
          {storeName}
        </Text>
        <Text
          className="text-slate-500 text-sm font-semibold leading-6"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="text-slate-900 text-lg font-bold leading-6">
          {price}
        </Text>
      </View>
    </View>
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
  storeName: string;
  title: string;
  price: string;
  image?: string;
}

const COUPONS: CouponItem[] = [
  {
    id: 0,
    used: false,
    storeName: "GS25",
    title: "GS25 새콤달콤 포도맛 15% 할인 쿠폰",
    price: "200P",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 1,
    used: true,
    storeName: "CU",
    title: "CU 아메리카노 20% 할인 쿠폰",
    price: "150P",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    used: false,
    storeName: "스타벅스",
    title: "스타벅스 카라멜 마키아토 10% 할인 쿠폰",
    price: "300P",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    used: true,
    storeName: "맥도날드",
    title: "맥도날드 빅맥 세트 15% 할인 쿠폰",
    price: "500P",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    used: false,
    storeName: "올리브영",
    title: "올리브영 스킨케어 10% 할인 쿠폰",
    price: "100P",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    used: false,
    storeName: "배달의민족",
    title: "배달의민족 치킨 3,000원 할인 쿠폰",
    price: "400P",
    image: "https://via.placeholder.com/150",
  },
];

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
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [allCoupons, setAllCoupons] = useState<CouponItem[]>([]); // fallback

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (activeTab === "사용 가능") {
          const data = await getCoupons("ISSUED");
          console.log("API 응답:", data);
          const transformed = data.map((item: any) => ({
            id: item.couponHistId,
            used: false,
            storeName: item.couponStore,
            title: item.couponNm,
            price: item.couponPoint + "P",
            image: item.couponImgUrl,
          }));
          setCoupons(transformed);
          setAllCoupons(transformed);
        } else if (activeTab === "사용 완료") {
          const data = await getCoupons("USED");
          console.log("API 응답:", data);
          const transformed = data.map((item: any) => ({
            id: item.couponHistId,
            used: true,
            storeName: item.couponStore,
            title: item.couponNm,
            price: item.couponPoint + "P",
            image: item.couponImgUrl,
          }));
          setCoupons(transformed);
          setAllCoupons(transformed);
        } else if (activeTab === "찜한 쿠폰") {
          // 찜한 쿠폰은 선택된 쿠폰들
          setCoupons(
            allCoupons.filter((coupon) => !!selectedCoupons[coupon.id]),
          );
        }
      } catch (error) {
        console.error("쿠폰 로딩 실패:", error);
        setCoupons([]);
      }
    };

    fetchCoupons();
  }, [activeTab, selectedCoupons, allCoupons]);

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
        {coupons.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-slate-300 text-base font-semibold">
              {EMPTY_MESSAGES[activeTab]}
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-x-[14px] gap-y-[18px]">
            {coupons.map((coupon) => (
              <View key={coupon.id} className="w-[calc(50%-7px)]">
                <CouponCard
                  storeName={coupon.storeName}
                  title={coupon.title}
                  price={coupon.price}
                  used={coupon.used}
                  selected={!!selectedCoupons[coupon.id]}
                  image={coupon.image}
                  onToggle={() => toggle(coupon.id)}
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
