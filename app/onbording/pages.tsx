import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Logo from "../../assets/images/logo_green.svg";
import { setOnboardingCompleted } from "../../src/utils/storage";

const ONBOARDING_PAGES = [
  {
    title: "잔반 인증하고, 포인트로 바꿔보세요!",
    subtitle: "버리지 않은 한 끼가, 보상이 됩니다",
    graphicSource: require("../../assets/images/onboarding_1.png"),
  },
  {
    title: "다 먹은 식판, 간편하게 인증해요",
    subtitle: "싹 AI로 가볍게 인증해요!",
    graphicSource: require("../../assets/images/onboarding_2.png"),
  },
  {
    title: "남김없는 한 끼가 더 큰 보상이 돼요",
    subtitle: "잔반을 남기지 않을수록 포인트가 더 쌓여요",
    graphicSource: require("../../assets/images/onboarding_3.png"),
  },
  {
    title: "모은 포인트를 각종 쿠폰으로 !",
    subtitle: "포인트는 각종 쿠폰으로 교환 가능해요",
    graphicSource: require("../../assets/images/onboarding_4.png"),
  },
] as const;

export default function Pages() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const graphicWidth = Math.min(width - 32, 251);
  const graphicHeight = (graphicWidth * 508) / 251;

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextPage = Math.round(event.nativeEvent.contentOffset.x / width);
    const clampedPage = Math.max(
      0,
      Math.min(ONBOARDING_PAGES.length - 1, nextPage),
    );
    setCurrentPage(clampedPage);
  };

  return (
    <View className="flex-1 bg-white pt-[72px]">
      <View className="px-4 items-start">
        <Logo />
      </View>
      <View className="h-5" />
      <View className="w-full">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          decelerationRate="fast"
        >
          {ONBOARDING_PAGES.map((item, index) => {
            return (
              <View key={index} className="px-4" style={{ width }}>
                <View className="w-full items-center">
                  <Image
                    source={item.graphicSource}
                    resizeMode="contain"
                    style={{
                      width: graphicWidth,
                      height: graphicHeight,
                    }}
                  />
                </View>
                <View className="h-8" />
                <View className="w-full items-center">
                  <Text className="text-gray-900 text-xl font-semibold leading-8 text-center">
                    {item.title}
                  </Text>
                  <View className="h-1" />
                  <Text className="text-gray-600 text-base font-medium leading-6 text-center">
                    {item.subtitle}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View className="h-[26px]" />

        <View className="self-stretch flex-row justify-center items-center gap-2">
          {ONBOARDING_PAGES.map((_, index) => (
            <View
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${index === currentPage ? "bg-green-500" : "bg-gray-200"}`}
            />
          ))}
        </View>
      </View>

      {currentPage === ONBOARDING_PAGES.length - 1 ? (
        <TouchableOpacity
          onPress={async () => {
            await setOnboardingCompleted(true);
            router.replace("/auth/landing");
          }}
          className="absolute left-4 right-4 bottom-[56px]"
          activeOpacity={0.8}
        >
          <View className="self-stretch h-[52px] p-3 rounded-xl justify-center items-center bg-[#45B310]">
            <Text className="text-center text-white text-lg font-medium leading-7">
              시작하기
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
