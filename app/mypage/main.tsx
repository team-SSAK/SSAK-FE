import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import Avatar from "../../assets/images/avatar.svg";
import ChevronRightG from "../../assets/images/chevron-right-gray.svg";
import ChevronRightW from "../../assets/images/chevron-right-white.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import Home from "../../assets/images/home.svg";
import Setting from "../../assets/images/setting.svg";
import Star from "../../assets/images/star.svg";
import User from "../../assets/images/user.svg";

import { useCoupons } from "@/src/hooks/useCoupons";
import { useMe } from "../../src/hooks/useMe";
import { usePoint } from "../../src/hooks/usePoint";
import { useRestaurantWish } from "../../src/hooks/useRestaurantWish";

//////////////////////////////////////////////////////
// 타입
//////////////////////////////////////////////////////

interface RestaurantWishResponse {
  restaurantWishId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantImgUrl: string;
}

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
}

const CouponCard = ({
  storeName = "가게이름",
  title = "쿠폰 제목",
  price = "0P",
  selected = false,
  image,
  onToggle,
}: CouponCardProps) => {
  return (
    <View className="flex-col gap-2.5">
      <View className="w-40 h-40 p-1 rounded-md bg-slate-100 justify-end items-end overflow-hidden">
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            resizeMode="cover"
          />
        ) : null}

        <TouchableOpacity className="m-3.5" onPress={onToggle}>
          {selected ? <HeartFilled /> : <Heart />}
        </TouchableOpacity>
      </View>

      <View className="w-40">
        <Text className="text-slate-500 text-xs font-semibold">
          {storeName}
        </Text>
        <Text
          className="text-slate-500 text-sm font-semibold"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="text-slate-900 text-lg font-bold">{price}</Text>
      </View>
    </View>
  );
};

//////////////////////////////////////////////////////
// 식당 배너 (기존 더미 - 주석 처리)
//////////////////////////////////////////////////////

/*
const ResBanner = ({
  name = "이화여자대학교 기숙사 한우리집",
  mealType = "중식",
  menu = "제육볶음, 쌀밥, 미역국 김치찌개, 요구르트",
}) => {
  return (
    <View className="px-4 py-4 bg-slate-100 rounded-2xl gap-5">
      <Text
        className="text-slate-800 text-base font-semibold leading-6"
        numberOfLines={1}
      >
        {name}
      </Text>
      <View>
        <Text className="text-slate-800 text-xs font-semibold leading-5">
          {mealType}
        </Text>
        <Text
          className="text-slate-400 text-xs font-medium leading-5"
          numberOfLines={1}
        >
          {menu}
        </Text>
      </View>
    </View>
  );
};
*/

//////////////////////////////////////////////////////
// 식당 배너 (API 기반)
//////////////////////////////////////////////////////

const ResBanner = ({
  name,
  address,
  image,
}: {
  name: string;
  address: string;
  image?: string;
}) => {
  return (
    <View className="w-60 px-4 py-4 bg-slate-100 rounded-2xl gap-3">
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-full h-28 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-28 rounded-lg bg-slate-200" />
      )}

      <Text
        className="text-slate-800 text-base font-semibold"
        numberOfLines={1}
      >
        {name}
      </Text>

      <Text className="text-slate-400 text-xs font-medium" numberOfLines={1}>
        {address}
      </Text>
    </View>
  );
};

//////////////////////////////////////////////////////
// 하단 네비
//////////////////////////////////////////////////////

function BottomNav() {
  return (
    <View className="absolute bottom-0 left-0 right-0 h-20 pb-4 bg-white flex-row justify-around items-center shadow-[0_-1px_10px_rgba(198,198,198,0.25)]">
      <View className="items-center">
        <Home width={24} height={24} />
        <Text className="text-gray-500 text-xs">홈</Text>
      </View>
      <View className="items-center">
        <Star width={24} height={24} />
        <Text className="text-gray-500 text-xs">스토어</Text>
      </View>
      <View className="items-center">
        <User width={24} height={24} />
        <Text className="text-gray-500 text-xs">마이페이지</Text>
      </View>
    </View>
  );
}

//////////////////////////////////////////////////////
// 메인 페이지
//////////////////////////////////////////////////////

export default function Main() {
  const router = useRouter();

  const [selectedCoupons, setSelectedCoupons] = useState<boolean[]>([]);

  const { me } = useMe();
  const { point } = usePoint();
  const { coupons } = useCoupons("ISSUED");

  // 즐겨찾기 식당 (개수 제한 없음)
  const { data: restaurantData } = useRestaurantWish();

  const restaurants = Array.isArray(restaurantData)
    ? restaurantData.map((item: RestaurantWishResponse) => ({
        id: item.restaurantId,
        name: item.restaurantName,
        address: item.restaurantLocation,
        image: item.restaurantImgUrl,
      }))
    : [];

  useEffect(() => {
    setSelectedCoupons(new Array(coupons.length).fill(false));
  }, [coupons]);

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
        <View className="py-4 flex-row justify-between items-center">
          <Text className="text-green-500 text-lg font-bold">SSAK</Text>
          <TouchableOpacity onPress={() => router.push("/mypage/setting")}>
            <Setting width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* 프로필 */}
        <View className="flex-row items-center mt-2.5 mb-[18px]">
          <Avatar />

          <View className="flex-1 flex-row items-end gap-0.5 ml-3.5">
            <Text className="text-2xl font-semibold text-black">
              {me?.userNm ?? ""}
            </Text>
            <Text className="text-base font-semibold text-black">님</Text>
          </View>

          {/* 수정 버튼 */}
          <TouchableOpacity
            onPress={() => router.push("/mypage/editprofile")}
            className="px-4 py-[3px] bg-slate-100 rounded-[999px] justify-center items-center"
          >
            <Text className="text-slate-400 text-xs font-semibold leading-5">
              수정
            </Text>
          </TouchableOpacity>
        </View>

        {/* 포인트 */}
        <View className="mb-[38px]">
          <TouchableOpacity onPress={() => router.push("/mypage/point")}>
            <View className="px-4 py-3.5 bg-green-300 rounded-xl">
              <Text className="text-white text-sm font-medium">내 포인트</Text>
              <View className="flex-row items-center">
                <Text className="text-white text-xl font-semibold">
                  {point}P
                </Text>
                <ChevronRightW />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 쿠폰 */}
        <View className="gap-3 mb-10">
          <View className="flex-row justify-between">
            <Text className="text-gray-800 text-lg font-semibold">내 쿠폰</Text>
            <TouchableOpacity onPress={() => router.push("/mypage/coupon")}>
              <ChevronRightG />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 15 }}
          >
            {coupons.map((coupon, index) => (
              <CouponCard
                key={coupon.id}
                storeName={coupon.storeName}
                title={coupon.title}
                price={coupon.price}
                image={coupon.image}
                selected={selectedCoupons[index]}
                onToggle={() => {
                  const updated = [...selectedCoupons];
                  updated[index] = !updated[index];
                  setSelectedCoupons(updated);
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* 식당 */}
        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-800 text-lg font-semibold">내 식당</Text>
            <TouchableOpacity onPress={() => router.push("/mypage/restaurant")}>
              <ChevronRightG />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 15 }}
          >
            {restaurants.map((restaurant) => (
              <ResBanner
                key={restaurant.id}
                name={restaurant.name}
                address={restaurant.address}
                image={restaurant.image}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}
