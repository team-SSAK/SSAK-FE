import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import Succeeded from "../../assets/images/succeeded.png";

export default function CameraSucceeded() {
  const { addedPoint, currentPoint, leftoverRatio } = useLocalSearchParams<{
    addedPoint: string;
    currentPoint: string;
    leftoverRatio: string;
  }>();

  const leftoverPct = Math.round((1 - Number(leftoverRatio ?? 1)) * 100);
  const certPct = `${leftoverPct}%`;

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-[56px] pb-[140px]">
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
        </View>
        <View className="h-[51px]" />
        <View className="flex flex-col gap-0.5 items-center justify-center">
          <Text className="text-gray-900 text-2xl font-semibold leading-10">
            잔반 인증을 성공적으로 완료했어요!
          </Text>
          <Text className="text-gray-500 text-base font-medium leading-6">
            잠시 후 포인트가 적립됩니다.
          </Text>
        </View>
        <View className="mt-[48px] items-center justify-center">
          <Image
            source={Succeeded}
            resizeMode="contain"
            style={{ width: 287, height: 215 }}
          />
        </View>
        <View className="mt-[40px] self-stretch px-4 py-3 bg-gray-50 rounded-[10px] flex-row justify-between items-center">
          <Text className="text-gray-500 text-base font-semibold leading-6">
            인증률
          </Text>
          <Text className="text-gray-900 text-lg font-semibold leading-7">
            {certPct}
          </Text>
        </View>
        <View className="mt-[12px] self-stretch px-4 py-3 bg-gray-50 rounded-[10px] flex-col items-end gap-1">
          <View className="self-stretch flex-row justify-between items-center">
            <Text className="text-gray-500 text-base font-semibold leading-6">
              내 포인트
            </Text>
            <Text className="text-gray-900 text-lg font-semibold leading-7">
              {currentPoint}
            </Text>
          </View>
          <View className="px-2.5 py-0.5 bg-green-300 rounded-md items-center justify-center">
            <Text className="text-white text-xs font-semibold leading-5">
              +{addedPoint}
            </Text>
          </View>
        </View>
      </View>

      <View className="absolute bottom-0 left-0 right-0 px-4 pb-[56px]">
        <TouchableOpacity onPress={() => router.push("/home/home")}>
          <View className="h-[52px] p-3 bg-green-400 rounded-xl justify-center items-center">
            <Text className="text-center text-gray-50 text-lg font-medium leading-7">
              홈으로 돌아가기
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
