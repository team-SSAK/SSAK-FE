import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
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

import Logo from "../../assets/images/logo_green.svg";

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
  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View
          className="w-full flex-1 overflow-hidden"
          style={{
            width: screenWidth,
            aspectRatio: headerAspectRatio,
            position: "relative",
            backgroundColor: "#22c55e",
          }}
        >
          <Image
            source={headerImageSource}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
              transform: [{ scale: 1.7 }],
            }}
          />

          {/* 탑 그라디언트 */}
          <TopGradientSVG
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
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
              zIndex: 2,
            }}
            width="100%"
            preserveAspectRatio="none"
          />

          <View
            className="absolute inset-0 px-4 pt-[56px] pb-4 flex-col justify-between"
            style={{ zIndex: 3 }}
          >
            <View className="py-4 flex-row justify-between items-center">
              <Logo />
              <TouchableOpacity onPress={() => router.push("/mypage/setting")}>
                <HorizontalEllipsis />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col gap-[2px]">
              <Text className="text-[22px] leading-[30.8px] text-white">
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

        {/* 헤더 아래 컨텐츠에만 패딩 적용 */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 120 }}>
          {/* 잔반 인증하러 가기 */}
          <TouchableOpacity onPress={() => router.push("/home/restaurant")}>
            <View className="h-[52px] p-3 mt-4 mb-[30px] bg-green-400 rounded-xl justify-center items-center">
              <Text className="text-center text-gray-50 text-lg font-medium leading-7">
                잔반 인증하러 가기
              </Text>
            </View>
          </TouchableOpacity>
          {/* 식당 */}
          <View className="gap-2">
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
                  <TouchableOpacity
                    key={restaurant.id}
                    onPress={() =>
                      router.push({
                        pathname: "/home/restaurantdetail",
                        params: {
                          restaurantId: String(restaurant.id),
                          restaurantImage: restaurant.image ?? "",
                        },
                      })
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
            )}
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
                    marginRight:
                      index === newsCards.length - 1 ? 0 : newsCardGap,
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
            <TouchableOpacity
              onPress={() => router.push("/home/anouncement")}
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-center w-full">
                <Text className="text-gray-800 text-lg font-semibold">
                  공지사항
                </Text>
                <ChevronRightG />
              </View>
            </TouchableOpacity>

            <>
              <TouchableOpacity
                onPress={() => Linking.openURL(ANNOUNCEMENT_URL)}
              >
                <AnouncementCard />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL(ANNOUNCEMENT_URL)}
              >
                <AnouncementCard />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL(ANNOUNCEMENT_URL)}
              >
                <AnouncementCard />
              </TouchableOpacity>
            </>
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}
