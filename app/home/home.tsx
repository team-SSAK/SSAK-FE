import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import ChevronRightG from "../../assets/images/chevron-right-gray.svg";
import HorizontalEllipsis from "../../assets/images/Horizontal-Ellipsis.svg";

import { BottomNav } from "../../components/bottomnav";

import { useCoupons } from "@/src/hooks/useCoupons";
import { LinearGradient } from "expo-linear-gradient";
import AnouncementCard from "../../components/anouncementcard";
import { useMe } from "../../src/hooks/useMe";
import { usePoint } from "../../src/hooks/usePoint";
import { useRestaurantWish } from "../../src/hooks/useRestaurantWish";
import { postCouponWish } from "../../src/services/mypage/coupons.service";

const headerImageSource = require("../../assets/images/SSAK.png");
const headerImageAsset = Asset.fromModule(headerImageSource);
const headerAspectRatio =
  headerImageAsset.width && headerImageAsset.height
    ? headerImageAsset.width / headerImageAsset.height
    : 1.6;
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
// 메인 페이지
//////////////////////////////////////////////////////

export default function Main() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const newsCardGap = 16;
  const newsCardWidth = screenWidth - 32;
  const newsPageInterval = newsCardWidth + newsCardGap;
  const newsCards = [1, 2, 3, 4];
  const [newsPage, setNewsPage] = useState(0);

  const [selectedCoupons, setSelectedCoupons] = useState<
    Record<number, boolean>
  >({});

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

  const handleNewsScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / newsPageInterval);
    const clampedPage = Math.max(0, Math.min(newsCards.length - 1, page));
    setNewsPage(clampedPage);
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
        <View
          className="-mt-4 -mx-4 justify-start overflow-hidden"
          style={{
            width: screenWidth,
            aspectRatio: headerAspectRatio,
            position: "relative",
            backgroundColor: "#22c55e",
          }}
        >
          <Image
            source={headerImageSource}
            resizeMode={Platform.OS === "web" ? "contain" : "cover"}
            style={{ width: "100%", height: "100%" }}
          />

          {/* 탑 그라디언트 - from-black to-black/0 */}
          <LinearGradient
            colors={["rgba(0,0,0,1)", "rgba(0,0,0,0)"] as const}
            style={{
              position: "absolute" as const,
              top: 0,
              left: 0,
              right: 0,
              height: 112, // h-28
            }}
          />

          {/* 바텀 그라디언트 */}
          <LinearGradient
            colors={["rgba(64,64,64,0)", "rgba(38,38,38,1)"] as const} // ✅ neutral-700/0 → neutral-800
            style={{
              position: "absolute" as const,
              bottom: 0,
              left: 0,
              right: 0,
              height: 128,
            }}
          />

          <View className="absolute inset-0 px-4 pt-[56px] pb-4 flex-col justify-between">
            <View className="py-4 flex-row justify-between items-center">
              <Text className="text-white text-lg font-bold">SSAK</Text>
              <TouchableOpacity onPress={() => router.push("/mypage/setting")}>
                <HorizontalEllipsis />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col gap-[2px]">
              <Text className="text-white text-xl font-normal leading-8">
                잔반 인증하고
                {"\n"}
                함께 싹 틔워요!
              </Text>
              <Text className="text-green-100 text-xs font-bold leading-4">
                포인트로 다양한 선물 교환 가능
              </Text>
            </View>
          </View>
        </View>

        {/* 잔반 인증하러 가기 */}
        <TouchableOpacity onPress={() => router.push("/home/restaurant")}>
          <View className="h-12 p-3 mt-4 mb-[30px] bg-green-400 rounded-xl justify-center items-center">
            <Text className="text-center text-gray-50 text-lg font-medium leading-7">
              잔반 인증하러 가기
            </Text>
          </View>
        </TouchableOpacity>
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
              <TouchableOpacity
                key={restaurant.id}
                onPress={() =>
                  router.push(
                    `/home/restaurantdetail?restaurantId=${restaurant.id}`,
                  )
                }
              >
                <ResBanner
                  name={restaurant.name}
                  address={restaurant.address}
                  image={restaurant.image}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="h-6" />

        {/* 주목할 소식 */}
        <View className="gap-3">
          <Text className="text-gray-800 text-lg font-semibold">
            주목할 소식
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            disableIntervalMomentum
            snapToInterval={newsPageInterval}
            snapToAlignment="start"
            onMomentumScrollEnd={handleNewsScrollEnd}
          >
            {newsCards.map((card, index) => (
              <View
                key={card}
                style={{
                  width: newsCardWidth,
                  marginRight: index === newsCards.length - 1 ? 0 : newsCardGap,
                }}
                className="h-28 rounded-lg bg-gray-500"
              />
            ))}
          </ScrollView>

          <View className="flex flex-row gap-2 items-center justify-center">
            {newsCards.map((_, index) => (
              <View
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${index === newsPage ? "bg-green-500" : "bg-gray-200"}`}
              />
            ))}
          </View>
        </View>

        <View className="h-6" />

        {/* 공지사항 */}
        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-800 text-lg font-semibold">
              공지사항
            </Text>

            <TouchableOpacity onPress={() => router.push("/home/anouncement")}>
              <ChevronRightG />
            </TouchableOpacity>
          </View>

          <>
            <AnouncementCard />
            <AnouncementCard />
            <AnouncementCard />
          </>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}
