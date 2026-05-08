import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getAccessToken, getRefreshToken } from "../src/utils/storage";
import Landing from "./onbording/landing";

export default function Index() {
  const router = useRouter();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          getAccessToken(),
          getRefreshToken(),
        ]);

        if (!mounted) {
          return;
        }

        if (accessToken || refreshToken) {
          router.replace("/home/home");
          return;
        }
      } finally {
        if (mounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (isBootstrapping) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="small" color="#45B310" />
      </View>
    );
  }

  return <Landing />;
}
