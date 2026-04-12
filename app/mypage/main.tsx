import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import Avatar from "../../assets/images/avatar.svg";
import ChevronRightG from "../../assets/images/chevron-right-gray.svg";
import ChevronRightW from "../../assets/images/chevron-right-white.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import Logo from "../../assets/images/logo_green.svg";
import Setting from "../../assets/images/setting.svg";

import { BottomNav } from "../../components/bottomnav";

import { useCoupons } from "@/src/hooks/useCoupons";
import { useMe } from "../../src/hooks/useMe";
import { usePoint } from "../../src/hooks/usePoint";
import { useRestaurantWish } from "../../src/hooks/useRestaurantWish";
import { postCouponWish } from "../../src/services/mypage/coupons.service";

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
      className="flex-col gap-2.5"
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View className="relative w-40 h-40 rounded-md bg-slate-100 overflow-hidden">
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            resizeMode="cover"
          />
        ) : null}

        <TouchableOpacity
          className="absolute right-3.5 bottom-3.5"
          onPress={onToggle}
        >
          {selected ? <HeartFilled /> : <Heart />}
        </TouchableOpacity>
      </View>

      <View className="w-40">
        <Text className="text-slate-500 text-xs font-semibold">
          {storeName}
        </Text>
        <Text
          className="text-slate-500 text-sm font-semibold leading-6 h-12"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text className="text-slate-900 text-lg font-bold">{price}</Text>
      </View>
    </TouchableOpacity>
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
            <View className="w-96 h-64 px-4 py-9 bg-slate-100 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
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
      <Text
        className="text-slate-800 text-base font-semibold"
        numberOfLines={1}
      >
        {name}
      </Text>
      <View>
        <Text className="text-gray-800 text-xs font-semibold leading-5">
          중식
        </Text>
        <Text className="text-gray-500 text-xs font-medium" numberOfLines={1}>
          제육볶음, 쌀밥, 미역국 김치찌개, 요구르트
        </Text>
      </View>
    </View>
  );
};

//////////////////////////////////////////////////////
// 하단 네비
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// 메인 페이지
//////////////////////////////////////////////////////

export default function Main() {
  const router = useRouter();

  const [selectedCoupons, setSelectedCoupons] = useState<
    Record<number, boolean>
  >({});

  const { me } = useMe();
  const { point } = usePoint();
  const { coupons, isLoading: isCouponsLoading } = useCoupons("ISSUED");
  const [profileImageLoadError, setProfileImageLoadError] = useState(false);

  const profileImageUri = (me?.userProfileImg ?? "").trim();
  const shouldShowProfileImage =
    profileImageUri.length > 0 && !profileImageLoadError;

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

  const toggleCouponWish = async (id: number) => {
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
        <View className="pt-[56px] pb-4 flex-row justify-between items-center">
          <Logo />
          <TouchableOpacity onPress={() => router.push("/mypage/setting")}>
            <Setting width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* 프로필 */}
        <View className="flex-row items-center mt-2.5 mb-[18px]">
          {shouldShowProfileImage ? (
            <Image
              source={{ uri: profileImageUri }}
              style={{ width: 58, height: 58, borderRadius: 29 }}
              resizeMode="cover"
              onLoad={() => setProfileImageLoadError(false)}
              onError={() => setProfileImageLoadError(true)}
            />
          ) : (
            <Avatar />
          )}

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
          <TouchableOpacity
            onPress={() => router.push("/mypage/coupon")}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center w-full">
              <Text className="text-gray-800 text-lg font-semibold">
                내 쿠폰
              </Text>
              <ChevronRightG />
            </View>
          </TouchableOpacity>

          {isCouponsLoading || coupons.length === 0 ? (
            <View className="self-stretch h-64 px-4 py-9 bg-gray-50 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
              <View className="self-stretch flex flex-col justify-center items-center">
                <Text
                  className="self-stretch text-center justify-start text-gray-400 text-base font-semibold leading-6"
                  numberOfLines={1}
                >
                  보유중인 쿠폰이 없어요!
                </Text>
                <Text
                  className="justify-start text-gray-400 text-xs font-medium leading-5"
                  numberOfLines={1}
                >
                  포인트를 통해 쿠폰을 교환해보세요
                </Text>
              </View>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 15 }}
            >
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  storeName={coupon.storeName}
                  title={coupon.title}
                  price={coupon.price}
                  image={coupon.image}
                  selected={!!selectedCoupons[coupon.id]}
                  onToggle={() => toggleCouponWish(coupon.id)}
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
              ))}
            </ScrollView>
          )}
        </View>

        {/* 식당 */}
        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.push("/mypage/restaurant")}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center w-full">
              <Text className="text-gray-800 text-lg font-semibold">
                내 식당
              </Text>
              <ChevronRightG />
            </View>
          </TouchableOpacity>

          {restaurants.length === 0 ? (
            <View className="w-full h-[114px] px-4 py-4 bg-gray-50 rounded-2xl flex flex-col justify-center items-center gap-2.5 mx-auto">
              <View className="self-stretch flex flex-col justify-center items-center">
                <Text
                  className="self-stretch text-center justify-start text-gray-400 text-base font-semibold leading-6"
                  numberOfLines={1}
                >
                  아직 등록된 식당이 없어요 !
                </Text>
                <Text
                  className="justify-start text-gray-400 text-xs font-medium leading-5"
                  numberOfLines={1}
                >
                  자주 이용하는 식당을 즐겨찾기에 추가해보세요
                </Text>
              </View>
            </View>
          ) : (
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
          )}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}
