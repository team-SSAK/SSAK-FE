import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";

import SearchB from "../../assets/images/searchB.svg";

import ActionPopup from "../../components/actionpopup";
import { BottomNav } from "../../components/bottomnav";
import SearchInput from "../../components/searchinput";

import { useStoreCoupons } from "@/src/hooks/useStoreCoupons";
import { postCouponWish } from "../../src/services/mypage/coupons.service";
import { StoreCouponType } from "../../src/services/store/coupons.service";

import ChevronDown from "../../assets/images/chevron-down.svg";

import Logo from "../../assets/images/logo_green.svg";

//////////////////////////////////////////////////////
// 쿠폰 카드
//////////////////////////////////////////////////////

interface CouponCardProps {
  storeName?: string;
  title?: string;
  price?: string;
  selected?: boolean;
  image?: string;
  onToggle?: () => void;
  onPress?: () => void;
}

const CouponCard = ({
  storeName = "가게이름",
  title = "쿠폰 제목",
  price = "0P",
  selected = false,
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

        <TouchableOpacity
          className="absolute right-3.5 bottom-3.5"
          onPress={onToggle}
        >
          {selected ? <HeartFilled /> : <Heart />}
        </TouchableOpacity>
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

//////////////////////////////////////////////////////
// 메인 페이지
//////////////////////////////////////////////////////

const EMPTY_MESSAGE = "사용 가능한 쿠폰이 없습니다";

export default function Main() {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<StoreCouponType | null>(
    null,
  );

  const [selectedCoupons, setSelectedCoupons] = useState<
    Record<number, boolean>
  >({});

  const { coupons, loading } = useStoreCoupons(selectedFilter);

  const filteredCoupons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return coupons;
    }

    return coupons.filter((coupon) =>
      coupon.title.toLowerCase().includes(query),
    );
  }, [coupons, searchQuery]);

  const toggleCouponWish = async (id: number) => {
    if (id <= 0) {
      console.log("쿠폰 id가 없어 찜하기를 수행할 수 없습니다.");
      return;
    }

    const isCurrentlySelected = !!selectedCoupons[id];

    if (!isCurrentlySelected) {
      // 찜하기 추가
      try {
        await postCouponWish(id);
        setSelectedCoupons((prev) => ({ ...prev, [id]: true }));
      } catch (error) {
        console.error("쿠폰 찜하기 실패:", error);
      }
    } else {
      // 찜하기 해제 (로컬에서만 처리)
      setSelectedCoupons((prev) => ({ ...prev, [id]: false }));
    }
  };

  const [sortLabel, setSortLabel] = useState("최신순");
  const [showSortPopup, setShowSortPopup] = useState(false);

  const onOpenSortPopup = () => {
    setShowSortPopup(true);
  };

  const onSelectSort = (label: string) => {
    setSortLabel(label);
    setShowSortPopup(false);
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* 헤더 */}
        <View className="pt-[56px] pb-4 flex-row justify-between items-center gap-3">
          {isSearchMode ? (
            <View className="flex-1">
              <SearchInput
                placeholder="쿠폰명을 검색해주세요."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                onBlur={() => setIsSearchMode(false)}
              />
            </View>
          ) : (
            <>
              <Logo />
              <TouchableOpacity onPress={() => setIsSearchMode(true)}>
                <SearchB width={24} height={24} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* sorting chips */}
        <View className="py-4 flex flex-row gap-2.5">
          <TouchableOpacity
            onPress={() => setSelectedFilter(null)}
            className={`px-4 py-2 rounded-[999px] inline-flex justify-center items-center ${selectedFilter === null ? "bg-gray-600" : "bg-gray-100"}`}
          >
            <Text
              className={`text-sm font-semibold leading-6 ${selectedFilter === null ? "text-white" : "text-gray-500"}`}
            >
              전체
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedFilter("CAFE")}
            className={`px-4 py-2 rounded-[999px] inline-flex justify-center items-center ${selectedFilter === "CAFE" ? "bg-gray-600" : "bg-gray-100"}`}
          >
            <Text
              className={`text-sm font-semibold leading-6 ${selectedFilter === "CAFE" ? "text-white" : "text-gray-500"}`}
            >
              카페
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedFilter("CONVENIENT_STORE")}
            className={`px-4 py-2 rounded-[999px] inline-flex justify-center items-center ${selectedFilter === "CONVENIENT_STORE" ? "bg-gray-600" : "bg-gray-100"}`}
          >
            <Text
              className={`text-sm font-semibold leading-6 ${selectedFilter === "CONVENIENT_STORE" ? "text-white" : "text-gray-500"}`}
            >
              편의점
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedFilter("MEAL")}
            className={`px-4 py-2 rounded-[999px] inline-flex justify-center items-center ${selectedFilter === "MEAL" ? "bg-gray-600" : "bg-gray-100"}`}
          >
            <Text
              className={`text-sm font-semibold leading-6 ${selectedFilter === "MEAL" ? "text-white" : "text-gray-500"}`}
            >
              식사
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedFilter("CERTIFICATE")}
            className={`px-4 py-2 rounded-[999px] inline-flex justify-center items-center ${selectedFilter === "CERTIFICATE" ? "bg-gray-600" : "bg-gray-100"}`}
          >
            <Text
              className={`text-sm font-semibold leading-6 ${selectedFilter === "CERTIFICATE" ? "text-white" : "text-gray-500"}`}
            >
              상품권
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedFilter("ETC")}
            className={`px-4 py-2 rounded-[999px] inline-flex justify-center items-center ${selectedFilter === "ETC" ? "bg-gray-600" : "bg-gray-100"}`}
          >
            <Text
              className={`text-sm font-semibold leading-6 ${selectedFilter === "ETC" ? "text-white" : "text-gray-500"}`}
            >
              기타
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-end items-center">
          <TouchableOpacity
            onPress={onOpenSortPopup}
            className="flex flex-row gap-0.5 items-center"
          >
            <Text className="text-base text-gray-500 font-semibold leading-6">
              {sortLabel}
            </Text>
            <ChevronDown width="18px" height="18px" />
          </TouchableOpacity>
        </View>

        <View className="pt-5">
          {!loading && filteredCoupons.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-slate-300 text-base font-semibold">
                {searchQuery.trim() ? "검색 결과가 없습니다" : EMPTY_MESSAGE}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between gap-y-[18px]">
              {filteredCoupons.map((coupon) => (
                <View key={coupon.id} className="w-[48%]">
                  <CouponCard
                    storeName={coupon.storeName}
                    title={coupon.title}
                    price={coupon.price}
                    selected={!!selectedCoupons[coupon.id]}
                    image={coupon.image}
                    onToggle={() => toggleCouponWish(coupon.id)}
                    onPress={() =>
                      router.push({
                        pathname: "/store/coupon",
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
        </View>
      </ScrollView>

      <BottomNav />

      <Modal
        visible={showSortPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortPopup(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.1)" }}
          onPress={() => setShowSortPopup(false)}
        >
          <View className="absolute top-[180px] right-4">
            <Pressable>
              <ActionPopup
                options={[
                  {
                    label: "인기순",
                    color: "text-gray-800",
                    onPress: () => onSelectSort("인기순"),
                  },
                  {
                    label: "저렴한순",
                    color: "text-gray-800",
                    onPress: () => onSelectSort("저렴한순"),
                  },
                  {
                    label: "최신순",
                    color: "text-gray-800",
                    onPress: () => onSelectSort("최신순"),
                  },
                ]}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
