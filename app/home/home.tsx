import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import BottomGradientSVG from "../../assets/images/BottomGradient.svg";
import ChevronRightG from "../../assets/images/chevron-right-gray.svg";
import HorizontalEllipsis from "../../assets/images/Horizontal-Ellipsis.svg";
import TopGradientSVG from "../../assets/images/TopGradient.svg";

import { BottomNav } from "../../components/bottomnav";

import AnouncementCard from "../../components/anouncementcard";
import { useRestaurantWish } from "../../src/hooks/useRestaurantWish";

const headerImageSource = require("../../assets/images/SSAK.png");
const headerImageAsset = Asset.fromModule(headerImageSource);
const headerAspectRatio =
  headerImageAsset.width && headerImageAsset.height
    ? headerImageAsset.width / headerImageAsset.height
    : 1.6;

const ANNOUNCEMENT_URL =
  "https://www.notion.so/31fc1339dd7680e6add1d62805ab8dba?source=copy_link";
//////////////////////////////////////////////////////
// 타입
//////////////////////////////////////////////////////

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
    <View className="w-60 px-4 py-4 bg-slate-100 rounded-2xl gap-5">
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

export default function Home() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const newsCardGap = 16;
  const newsCardWidth = screenWidth - 32;
  const newsPageInterval = newsCardWidth + newsCardGap;
  const newsCards = [1, 2, 3, 4];
  const [newsPage, setNewsPage] = useState(0);

  // 즐겨찾기 식당 (개수 제한 없음)
  const { data: restaurantData = [] } = useRestaurantWish();

  const restaurants = restaurantData.map((item) => ({
    id: item.restaurantId,
    name: item.restaurantName,
    address: item.restaurantLocation,
    image: item.restaurantImgUrl,
  }));

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
          className="-mt-4 -mx-4 justify-start overflow-hidden items-between"
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

          {/* 탑 그라디언트 */}
          <TopGradientSVG
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
            width="100%"
            preserveAspectRatio="none"
          />

          {/* 바텀 그라디언트 */}
          <BottomGradientSVG
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              transform: [{ rotate: "180deg" }],
            }}
            width="100%"
            preserveAspectRatio="none"
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
          <View className="h-[52px] p-3 mt-4 mb-[30px] bg-green-400 rounded-xl justify-center items-center">
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
            <TouchableOpacity onPress={() => Linking.openURL(ANNOUNCEMENT_URL)}>
              <AnouncementCard />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(ANNOUNCEMENT_URL)}>
              <AnouncementCard />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(ANNOUNCEMENT_URL)}>
              <AnouncementCard />
            </TouchableOpacity>
          </>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}
