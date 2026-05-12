import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import PopUp from "../../components/PopUp";
import RestaurantLocationMap from "../../components/restaurant-location-map";
import { useRestaurantDetail } from "../../src/hooks/useRestaurant";
import { getItem } from "../../src/utils/storage";

const DEFAULT_PIN_COORD = {
  latitude: 37.5665,
  longitude: 126.978,
};

export default function RestaurantLoacation() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const restaurantIdValue = Number(
    Array.isArray(restaurantId) ? restaurantId[0] : restaurantId,
  );
  const isValidRestaurantId =
    Number.isFinite(restaurantIdValue) && restaurantIdValue > 0;

  const { data: restaurantDetail } = useRestaurantDetail(
    isValidRestaurantId ? restaurantIdValue : NaN,
  );

  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [limitPopupTitle, setLimitPopupTitle] = useState("");
  const [limitPopupMessage, setLimitPopupMessage] = useState("");
  const [displayTime, setDisplayTime] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const MEASUREMENT_LIMIT_KEY = "MEASUREMENT_LIMIT";
  const MEASUREMENT_INTERVAL_MS = 4 * 60 * 60 * 1000;
  const MEASUREMENTS_PER_DAY = 3;

  useEffect(() => {
    if (!showLimitPopup) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    const updateTimer = async () => {
      const times = await getTodayMeasurementTimes();

      if (times.length > 0) {
        const lastTime = Math.max(...times);
        const now = Date.now();
        const timeSinceLastMeasurement = now - lastTime;

        if (timeSinceLastMeasurement < MEASUREMENT_INTERVAL_MS) {
          const msRemaining =
            MEASUREMENT_INTERVAL_MS - timeSinceLastMeasurement;
          const secondsRemaining = Math.ceil(msRemaining / 1000);

          const hours = Math.floor(secondsRemaining / 3600);
          const minutes = Math.floor((secondsRemaining % 3600) / 60);
          const seconds = secondsRemaining % 60;

          const timeString = `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
          setDisplayTime(timeString);
        }
      }
    };

    void updateTimer();
    timerIntervalRef.current = setInterval(() => {
      void updateTimer();
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [showLimitPopup]);

  const getTodayMeasurementTimes = async (): Promise<number[]> => {
    try {
      const stored = await getItem(MEASUREMENT_LIMIT_KEY);
      if (!stored) return [];

      const data = JSON.parse(stored);
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).getTime();

      return data.filter((timestamp: number) => timestamp >= todayStart);
    } catch (e) {
      console.warn("Failed to get measurement times:", e);
      return [];
    }
  };

  const checkMeasurementLimit = async (): Promise<{
    allowed: boolean;
    title?: string;
    message?: string;
    displayTime?: string;
  }> => {
    const times = await getTodayMeasurementTimes();

    if (times.length >= MEASUREMENTS_PER_DAY) {
      return {
        allowed: false,
        title: "오늘 인증 횟수를 모두 사용했어요",
        message: "하루 최대 3번까지 인증할 수 있어요",
      };
    }

    if (times.length > 0) {
      const lastTime = Math.max(...times);
      const now = Date.now();
      const timeSinceLastMeasurement = now - lastTime;

      if (timeSinceLastMeasurement < MEASUREMENT_INTERVAL_MS) {
        const msRemaining = MEASUREMENT_INTERVAL_MS - timeSinceLastMeasurement;
        const secondsRemaining = Math.ceil(msRemaining / 1000);

        const hours = Math.floor(secondsRemaining / 3600);
        const minutes = Math.floor((secondsRemaining % 3600) / 60);
        const seconds = secondsRemaining % 60;

        const timeString = `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        return {
          allowed: false,
          title: `${timeString} 후에 다시 시도해주세요`,
          message: "인증은 4시간 간격으로 가능해요",
          displayTime: timeString,
        };
      }
    }

    return { allowed: true };
  };

  const latitude =
    restaurantDetail?.restaurantCoord?.lat ?? DEFAULT_PIN_COORD.latitude;
  const longitude =
    restaurantDetail?.restaurantCoord?.lon ?? DEFAULT_PIN_COORD.longitude;

  const restaurantTypeLabel =
    restaurantDetail?.restaurantType === "FOODCOURT"
      ? "푸드코트형"
      : restaurantDetail?.restaurantType === "FREESTYLE"
        ? "자율배식형"
        : (restaurantDetail?.restaurantType ?? "자율배식형");

  const formatTime = (time: unknown): string | null => {
    if (typeof time === "string") {
      const [hour, minute] = time.split(":");
      const h = Number(hour);
      const m = Number(minute);

      if (Number.isFinite(h) && Number.isFinite(m)) {
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      }

      return null;
    }

    if (typeof time !== "object" || time === null) {
      return null;
    }

    const obj = time as { hour?: unknown; minute?: unknown };
    const h = Number(obj.hour);
    const m = Number(obj.minute);

    if (!Number.isFinite(h) || !Number.isFinite(m)) {
      return null;
    }

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const openTime = formatTime(restaurantDetail?.openTime ?? null);
  const closeTime = formatTime(restaurantDetail?.closeTime ?? null);
  const operatingHours =
    openTime && closeTime ? `${openTime} - ${closeTime}` : "운영시간 정보 없음";

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-[56px]">
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">매장 상세</Text>
        </View>

        <View className="flex-1" style={{ marginHorizontal: -16 }}>
          <RestaurantLocationMap
            latitude={latitude}
            longitude={longitude}
            title={restaurantDetail?.restaurantName ?? "식당 정보"}
            description={restaurantDetail?.restaurantLocation ?? "식당 주소"}
          />
        </View>

        <View className="pt-4 flex flex-col">
          <View className="self-start px-2.5 py-0.5 bg-green-300 rounded-md justify-center items-center mb-1 ">
            <Text className="text-white text-xs font-semibold leading-5">
              {restaurantTypeLabel}
            </Text>
          </View>
          <Text className="justify-start text-gray-800 text-xl font-semibold leading-8">
            {restaurantDetail?.restaurantName ?? "식당 정보"}
          </Text>
          <View className="flex flex-row mt-2.5 ">
            <View className="flex flex-col gap-1 mr-[19px]">
              <Text className="text-gray-500 text-sm font-semibold leading-6">
                위치
              </Text>
              <Text className="text-gray-500 text-sm font-semibold leading-6">
                운영시간
              </Text>
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-gray-600 text-sm font-semibold leading-6 line-clamp-2">
                {restaurantDetail?.restaurantLocation ?? "식당 주소"}
              </Text>
              <Text className="text-gray-600 text-sm font-semibold leading-6 line-clamp-2">
                {operatingHours}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 잔반 인증 버튼 */}
      <View className="px-4 pb-[56px] pt-[37px]">
        <TouchableOpacity
          onPress={async () => {
            const limitCheck = await checkMeasurementLimit();
            if (!limitCheck.allowed) {
              setLimitPopupMessage(limitCheck.message || "다시 시도해주세요.");
              setLimitPopupTitle(limitCheck.title || "알림");
              setDisplayTime(limitCheck.displayTime || null);
              setShowLimitPopup(true);
              return;
            }
            router.push("/home/camera");
          }}
        >
          <View className="h-[52px] p-3 bg-green-400 rounded-xl justify-center items-center">
            <Text className="text-center text-gray-50 text-lg font-medium leading-7">
              잔반 인증하러 가기
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {showLimitPopup && (
        <PopUp
          title={
            displayTime
              ? `${displayTime} 후에 다시 시도해주세요`
              : limitPopupTitle
          }
          message={limitPopupMessage}
          onClose={() => setShowLimitPopup(false)}
        />
      )}
    </View>
  );
}
