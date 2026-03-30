import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import HomeSelected from "../assets/images/home-selected.svg";
import Home from "../assets/images/home.svg";
import Star from "../assets/images/star.svg";
import UserSelected from "../assets/images/user-selected.svg";
import User from "../assets/images/user.svg";

type TabKey = "home" | "store" | "mypage";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState<TabKey>("home");

  useEffect(() => {
    if (pathname === "/mypage/main") {
      setSelectedTab("mypage");
      return;
    }

    if (pathname === "/home/home") {
      setSelectedTab("home");
      return;
    }

    setSelectedTab("home");
  }, [pathname]);

  const handleHomePress = () => {
    setSelectedTab("home");
    if (pathname !== "/home/home") {
      router.push("/home/home");
    }
  };

  const handleStorePress = () => {
    setSelectedTab("store");
  };

  const handleMyPagePress = () => {
    setSelectedTab("mypage");
    if (pathname !== "/mypage/main") {
      router.push("/mypage/main");
    }
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 h-20 pb-4 bg-white flex-row justify-around items-center shadow-[0_-1px_10px_rgba(198,198,198,0.25)]">
      <TouchableOpacity className="items-center" onPress={handleHomePress}>
        {selectedTab === "home" ? (
          <HomeSelected width={24} height={24} />
        ) : (
          <Home width={24} height={24} />
        )}
        <Text
          className={`text-xs ${selectedTab === "home" ? "text-green-500" : "text-gray-500"}`}
        >
          홈
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center" onPress={handleStorePress}>
        <Star width={24} height={24} />
        <Text
          className={`text-xs ${selectedTab === "store" ? "text-green-500" : "text-gray-500"}`}
        >
          스토어
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center" onPress={handleMyPagePress}>
        {selectedTab === "mypage" ? (
          <UserSelected width={24} height={24} />
        ) : (
          <User width={24} height={24} />
        )}
        <Text
          className={`text-xs ${selectedTab === "mypage" ? "text-green-500" : "text-gray-500"}`}
        >
          마이페이지
        </Text>
      </TouchableOpacity>
    </View>
  );
}
