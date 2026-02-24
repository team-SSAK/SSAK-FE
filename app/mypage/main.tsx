import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Avatar from "../../assets/images/avatar.svg";
import ChevronRightG from "../../assets/images/chevron-right-gray.svg";
import ChevronRightW from "../../assets/images/chevron-right-white.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import Home from "../../assets/images/home.svg";
import Setting from "../../assets/images/setting.svg";
import Star from "../../assets/images/star.svg";
import User from "../../assets/images/user.svg";

interface CouponCardProps {
  storeName?: string;
  title?: string;
  price?: string;
  selected?: boolean;
  image?: React.ReactNode;
  onToggle?: () => void;
}

const CouponCard = ({
  storeName = "가게이름",
  title = "GS25 새콤달콤 포도맛 15% 할인 쿠폰",
  price = "200P",
  selected = false,
  image,
  onToggle,
}: CouponCardProps) => {
  return (
    <View className="flex-col gap-2.5">
      <View className="w-40 h-40 p-1 rounded-md bg-slate-100 justify-end items-end">
        {image ?? null}
        <TouchableOpacity className="m-3.5" onPress={onToggle}>
          {selected ? <HeartFilled /> : <Heart />}
        </TouchableOpacity>
      </View>

      <View className="w-40">
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

interface ResBannerProps {
  name?: string;
  mealType?: string;
  menu?: string;
}

const ResBanner = ({
  name = "이화여자대학교 기숙사 한우리집",
  mealType = "중식",
  menu = "제육볶음, 쌀밥, 미역국 김치찌개, 요구르트",
}: ResBannerProps) => {
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

function BottomNav() {
  return (
    <View className="absolute bottom-0 left-0 right-0 h-20 pb-4 bg-white flex-row justify-around items-center shadow-[0_-1px_10px_rgba(198,198,198,0.25)]">
      <View className="gap-0.5 justify-center items-center">
        <Home width={24} height={24} />
        <Text className="text-gray-500 text-xs font-medium leading-5">홈</Text>
      </View>
      <View className="gap-0.5 justify-center items-center">
        <Star width={24} height={24} />
        <Text className="text-gray-500 text-xs font-medium leading-5">
          스토어
        </Text>
      </View>
      <View className="gap-0.5 justify-center items-center">
        <User width={24} height={24} />
        <Text className="text-gray-500 text-xs font-medium leading-5">
          마이페이지
        </Text>
      </View>
    </View>
  );
}

export default function Main() {
  const router = useRouter();
  const [selectedCoupons, setSelectedCoupons] = useState([false, false, false]);

  return (
    <View className="flex-1 bg-white">
      {/* 🔹 스크롤 영역 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        <View className="py-4 flex-row justify-between items-center">
          <Text className="text-green-500 text-lg font-bold leading-7">
            SSAK
          </Text>
          <Setting width={24} height={24} />
        </View>

        {/* 프로필 */}
        <View className="flex-row items-center gap-3.5 mt-2.5 mb-[18px]">
          <Avatar />
          <View className="flex-1 flex-row items-end gap-0.5">
            <Text className="text-2xl font-semibold leading-10 text-black">
              이화연
            </Text>
            <Text className="text-base font-semibold leading-6 text-black">
              님
            </Text>
          </View>
          <View className="px-4 py-[3px] bg-gray-100 rounded-full">
            <Text className="text-gray-500 text-xs font-semibold leading-5">
              수정
            </Text>
          </View>
        </View>

        {/* 포인트 */}
        <View className="mb-[38px]">
          <View className="px-4 py-3.5 bg-green-300 rounded-xl">
            <Text className="text-white text-sm font-medium leading-6">
              내 포인트
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Text className="text-white text-xl font-semibold leading-8">
                342352P
              </Text>
              <ChevronRightW />
            </View>
          </View>
        </View>

        {/* 쿠폰 */}
        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-800 text-lg font-semibold leading-7">
              내 쿠폰
            </Text>
            <TouchableOpacity onPress={() => router.push("/mypage/coupon")}>
              <ChevronRightG />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            <CouponCard
              selected={selectedCoupons[0]}
              onToggle={() =>
                setSelectedCoupons((prev) => {
                  const newArr = [...prev];
                  newArr[0] = !newArr[0];
                  return newArr;
                })
              }
            />
            <CouponCard
              selected={selectedCoupons[1]}
              onToggle={() =>
                setSelectedCoupons((prev) => {
                  const newArr = [...prev];
                  newArr[1] = !newArr[1];
                  return newArr;
                })
              }
            />
            <CouponCard
              selected={selectedCoupons[2]}
              onToggle={() =>
                setSelectedCoupons((prev) => {
                  const newArr = [...prev];
                  newArr[2] = !newArr[2];
                  return newArr;
                })
              }
            />
          </ScrollView>
        </View>

        <View className="h-[48px]" />

        {/* 식당 */}
        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-800 text-lg font-semibold leading-7">
              내 식당
            </Text>
            <TouchableOpacity onPress={() => router.push("/mypage/restaurant")}>
              <ChevronRightG />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 15 }}
          >
            <ResBanner />
            <ResBanner />
          </ScrollView>
        </View>
      </ScrollView>

      {/* 하단 고정 */}
      <BottomNav />
    </View>
  );
}
