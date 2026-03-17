import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { Platform, Text, TextInput } from "react-native";
import "./global.css";

const IOS_TEXT_SCALE = 1.1;
let typographyDefaultsApplied = false;

function applyGlobalTypographyDefaults() {
  if (typographyDefaultsApplied) {
    return;
  }

  typographyDefaultsApplied = true;

  const textDefaults = (Text as any).defaultProps || {};
  (Text as any).defaultProps = {
    ...textDefaults,
    allowFontScaling:
      Platform.OS === "ios" ? false : textDefaults.allowFontScaling,
    maxFontSizeMultiplier:
      Platform.OS === "ios" ? 1 : textDefaults.maxFontSizeMultiplier,
    style: [
      textDefaults.style,
      { fontFamily: "Pretendard-Variable" },
      Platform.OS === "ios" ? { fontSize: 16 * IOS_TEXT_SCALE } : null,
    ],
  };

  const textInputDefaults = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps = {
    ...textInputDefaults,
    allowFontScaling:
      Platform.OS === "ios" ? false : textInputDefaults.allowFontScaling,
    maxFontSizeMultiplier:
      Platform.OS === "ios" ? 1 : textInputDefaults.maxFontSizeMultiplier,
    style: [
      textInputDefaults.style,
      { fontFamily: "Pretendard-Variable" },
      Platform.OS === "ios" ? { fontSize: 16 * IOS_TEXT_SCALE } : null,
    ],
  };
}

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);

  // 앱 초기화 동안 스플래시가 자동으로 숨겨지지 않도록 설정
  useEffect(() => {
    let mounted = true;
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch {
        // 스플래시가 등록되어 있지 않으면 무시
      }
    }
    prepare();
    return () => {
      mounted = false;
    };
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    "Pretendard-Variable": require("../assets/fonts/PretendardVariable.ttf"),
    Jalnan_2: require("../assets/fonts/Jalnan2TTF.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // 폰트 로딩이 완료되면 스플래시 스크린 숨김 (에러 무시)
      (async () => {
        try {
          await SplashScreen.hideAsync();
        } catch {
          // 스플래시가 없거나 이미 숨겨져 있으면 무시
        }
      })();
    }
  }, [fontsLoaded, fontError]);

  // 폰트 로딩 중이거나 에러가 있으면 null 반환 (스플래시 화면 유지)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  applyGlobalTypographyDefaults();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login/index" />
      </Stack>
    </QueryClientProvider>
  );
}
