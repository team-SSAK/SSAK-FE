import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import Logo from "../../assets/images/logo.svg";

import Bapuri from "../../assets/images/bapuri_onbording.svg";
export default function Landing() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onbording/pages");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-end bg-[#6DD155]">
      <Logo />
      <View className="h-[22px]" />
      <Text className="text-white text-sm font-bold leading-6">
        싹 비우고, 싹 틔우다
      </Text>
      <View className="h-[113px]" />
      <Bapuri width={width} />
    </View>
  );
}
