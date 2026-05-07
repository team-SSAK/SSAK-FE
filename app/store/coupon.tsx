import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import mockdiscription from "../../assets/images/mockdiscription.png";
import AlertPopup from "../../components/alertpopup";
import { useStoreCouponDetail } from "../../src/hooks/useStoreCoupons";
import { postCouponWish } from "../../src/services/mypage/coupons.service";
import { postCouponExchange } from "../../src/services/store/coupons.service";
import {
  addWishedCouponId,
  getWishedCouponIds,
  removeWishedCouponId,
} from "../../src/utils/storage";

type TabType = "상품설명" | "상세정보";
const TABS: TabType[] = ["상품설명", "상세정보"];

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <View className="flex-row mx-[-16px]">
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

export default function Coupon() {
  const { couponId } = useLocalSearchParams<{ couponId?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("상품설명");
  const [showExchangePopup, setShowExchangePopup] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);
  const [isWished, setIsWished] = useState(false);

  const couponIdValue = useMemo(() => {
    const rawCouponId = Array.isArray(couponId) ? couponId[0] : couponId;
    return Number(rawCouponId);
  }, [couponId]);
  const safeCouponId = Number.isFinite(couponIdValue) && couponIdValue > 0;
  const { coupon } = useStoreCouponDetail(safeCouponId ? couponIdValue : null);
  const couponImage = coupon?.couponImgUrl ?? "";
  const couponStoreName = coupon?.couponStore ?? "가게이름";
  const couponTitle = coupon?.couponName ?? "쿠폰 제목";
  const couponPrice = coupon ? `${coupon.couponPoint}P` : "0P";

  useFocusEffect(
    useCallback(() => {
      if (Number.isNaN(couponIdValue)) {
        return;
      }

      const fetchWishState = async () => {
        try {
          const wishedIds = await getWishedCouponIds();
          setIsWished(wishedIds.includes(couponIdValue));
        } catch (error) {
          console.error("찜한 쿠폰 로컬 조회 실패:", error);
        }
      };

      fetchWishState();
    }, [couponIdValue]),
  );

  const handleToggleWish = async () => {
    const previous = isWished;

    if (Number.isNaN(couponIdValue)) {
      return;
    }

    if (previous) {
      setIsWished(false);
      await removeWishedCouponId(couponIdValue);
      return;
    }

    setIsWished(true);
    await addWishedCouponId(couponIdValue);

    try {
      await postCouponWish(couponIdValue);
    } catch (error) {
      setIsWished(previous);
      await removeWishedCouponId(couponIdValue);
      console.error("쿠폰 찜하기 실패:", error);
    }
  };

  const handleExchangeConfirm = async () => {
    if (!safeCouponId || isExchanging) {
      return;
    }

    try {
      setIsExchanging(true);
      await postCouponExchange(couponIdValue);
      setShowExchangePopup(false);
      router.push({
        pathname: "/store/mycoupon",
        params: { couponId: String(couponIdValue) },
      });
    } catch (error) {
      console.error("쿠폰 교환 실패:", error);
    } finally {
      setIsExchanging(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 140,
        }}
      >
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">쿠폰 상세</Text>
        </View>

        <View
          className="bg-slate-100 overflow-hidden mb-4 mx-[-16px]"
          style={{ aspectRatio: 1 }}
        >
          {couponImage ? (
            <Image
              source={couponImage}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              contentPosition="center"
            />
          ) : null}
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-[#7E7E7E] text-sm font-semibold leading-6">
            {couponStoreName}
          </Text>
          <Text className="text-black text-xl font-semibold leading-8">
            {couponTitle}
          </Text>
          <Text className="text-black text-2xl font-semibold leading-10">
            {couponPrice}
          </Text>
        </View>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <View className="pt-[42px] pb-[84px] flex-1 items-center">
          {activeTab === "상품설명" ? (
            <Image
              source={couponImage || mockdiscription}
              style={{ width: "100%", aspectRatio: 375 / 1718 }}
              contentFit="contain"
              contentPosition="top"
            />
          ) : (
            <View className="w-full pt-[42px] pb-[90px] gap-[40px]">
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  사용 방법
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 결제 시 직원에게 쿠폰 사용 의사를 전달해주세요.{"\n"}-
                  직원이 인증번호를 입력하면 사용이 완료됩니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  사용 조건
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 일부 매장에서 사용이 제한될 수 있습니다.{"\n"}- 타 할인 및
                  이벤트와 중복 사용이 불가할 수 있습니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  유효기간
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 발급일로부터 60일 이내 사용 가능합니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  사용 방법
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 결제 시 직원에게 쿠폰 사용 의사를 전달해주세요.{"\n"}-
                  직원이 인증번호를 입력하면 사용이 완료됩니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  유의사항
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 사용 후 쿠폰은 재사용이 불가능합니다.{"\n"}- 환불 및
                  재발급이 불가합니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  인증 안내
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 매장에서 인증번호 입력 받아야 쿠폰이 적용됩니다.
                </Text>
              </View>
              <View className="flex flex-col gap-[5px] mt-[28px] items-center">
                <Text className="text-gray-800 font-semibold leading-6">
                  도움말을 통해 문제를 해결하지 못하셨나요?
                </Text>
                <Text className="text-center text-gray-500 text-sm font-semibold underline leading-6">
                  Seeders Lab에 직접 문의하기
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-4 pt-[14px] pb-[56px] bg-white">
        <View className="w-full flex-row gap-[11px]">
          <TouchableOpacity onPress={handleToggleWish}>
            <View className="w-14 h-[52px] p-3 bg-gray-100 rounded-xl justify-center items-center">
              {isWished ? <HeartFilled /> : <Heart />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1"
            onPress={() => setShowExchangePopup(true)}
          >
            <View className="w-full h-[52px] p-3 bg-green-400 rounded-xl justify-center items-center">
              <Text className="text-center text-gray-50 text-lg font-medium leading-7">
                교환하기
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <AlertPopup
        visible={showExchangePopup}
        title="쿠폰을 교환할까요 ?"
        description={`${couponTitle} 을 ${couponPrice} 와 교환할까요 ?`}
        onCancel={() => setShowExchangePopup(false)}
        onConfirm={handleExchangeConfirm}
        cancelText="아니요"
        confirmText="네"
      />
    </View>
  );
}
