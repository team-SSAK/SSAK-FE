import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left-w.svg";
import Info from "../../assets/images/info-circle.svg";
import Modal1 from "../../assets/images/modal_1.png";
import Modal2 from "../../assets/images/modal_2.png";
import RadioButton from "../../assets/images/radio-button.svg";
import { useMeasure } from "../../src/hooks/useMeasure";
import {
  getCameraGuideSkip,
  setCameraGuideSkip,
} from "../../src/utils/storage";

const CameraViewCompat: any = CameraView;

export default function Camera() {
  const cameraRef = useRef<any>(null);
  const { mutateAsync: measure, isPending } = useMeasure();
  const [permission, requestPermission] = useCameraPermissions();
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [currentGuidePage, setCurrentGuidePage] = useState(0);
  const [skipGuide, setSkipGuide] = useState(false);
  const { width: screenWidth } = useWindowDimensions();

  const guideViewportWidth = screenWidth;
  const guideHorizontalPadding = Math.max(0, (guideViewportWidth - 328) / 2);

  useEffect(() => {
    void getCameraGuideSkip().then((skipped) => {
      if (!skipped) setIsGuideVisible(true);
    });
  }, []);

  useEffect(() => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      void requestPermission();
    }
  }, [permission, requestPermission]);

  const renderCameraContent = () => {
    if (!permission) {
      return <View className="flex-1 bg-gray-800" />;
    }

    if (!permission.granted) {
      return (
        <View className="flex-1 bg-gray-800 items-center justify-center px-8">
          <Text className="text-white text-base font-medium text-center leading-6">
            카메라 권한을 허용하면 잔반 인증 화면을 사용할 수 있어요.
          </Text>
        </View>
      );
    }

    return (
      <CameraViewCompat ref={cameraRef} style={{ flex: 1 }} facing="back" />
    );
  };

  const handleGuideScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextPage = Math.round(event.nativeEvent.contentOffset.x / 340);
    setCurrentGuidePage(nextPage);
  };

  const renderGuideFirstPage = () => {
    return (
      <Pressable
        className="w-[328px] bg-white rounded-[20px] px-5 py-5"
        onPress={(event: any) => event.stopPropagation()}
      >
        <View className="w-72 gap-5 self-center">
          <View className="self-stretch gap-[14px]">
            <Text className="text-black text-xl font-semibold leading-8">
              잔반 인식 유의사항
            </Text>

            <View className="self-stretch gap-5">
              <View className="self-stretch gap-2.5">
                <Text className="text-gray-600 text-base font-medium leading-6">
                  1. 아래 예시 이미지와 같이 빈 그릇이 전부 나오도록
                  촬영해주세요.
                </Text>

                <View className="w-72 h-52 bg-slate-100 overflow-hidden self-center">
                  <Image
                    source={Modal1}
                    resizeMode="cover"
                    className="w-full h-full"
                  />
                </View>
              </View>

              <View className="self-stretch gap-3">
                <Text className="text-gray-600 text-base font-medium leading-6">
                  2. 한 번에 하나의 그릇만 인식해주세요.
                </Text>
                <Text className="text-red-500 text-base font-medium leading-6">
                  3. 밥 그릇이 아닌 반찬 그릇을 인식하는 경우 추후 불이익을 받을
                  수 있습니다.
                </Text>
              </View>
            </View>
          </View>

          <View className="w-72 self-center">
            <Text className="text-right text-slate-300 text-2xl font-semibold leading-10">
              →
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderGuideSecondPage = () => {
    return (
      <Pressable
        className="w-[328px] bg-white rounded-[20px] px-5 py-5"
        onPress={(event: any) => event.stopPropagation()}
      >
        <View className="w-72 gap-5 self-center">
          <View className="self-stretch gap-[14px]">
            <Text className="text-xl font-semibold leading-8 text-black">
              아래의 경우 <Text className="text-red-500">인식이 어려울 수</Text>
              있어요
            </Text>

            <View className="self-stretch items-center gap-5">
              <View className="w-72 h-52 bg-slate-100 overflow-hidden items-center justify-center">
                <Image
                  source={Modal2}
                  resizeMode="cover"
                  className="w-full h-full"
                />
              </View>

              <View className="w-64 gap-4 self-start">
                <View className="flex-row items-center gap-2">
                  <View className="w-5 h-5 bg-red-400 rounded-full items-center justify-center">
                    <Text
                      className="text-white text-[13px] font-semibold leading-[14px] text-center"
                      style={{
                        includeFontPadding: false,
                        textAlignVertical: "center",
                      }}
                    >
                      1
                    </Text>
                  </View>
                  <Text className="flex-1 text-gray-600 text-base font-medium leading-6">
                    초점이 맞지 않은 경우
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <View className="w-5 h-5 bg-red-400 rounded-full items-center justify-center">
                    <Text
                      className="text-white text-[13px] font-semibold leading-[14px] text-center"
                      style={{
                        includeFontPadding: false,
                        textAlignVertical: "center",
                      }}
                    >
                      2
                    </Text>
                  </View>
                  <Text className="flex-1 text-gray-600 text-base font-medium leading-6">
                    전체 식판 중 한 부분만 촬영한 경우
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <View className="w-5 h-5 bg-red-400 rounded-full items-center justify-center">
                    <Text
                      className="text-white text-[13px] font-semibold leading-[14px] text-center"
                      style={{
                        includeFontPadding: false,
                        textAlignVertical: "center",
                      }}
                    >
                      3
                    </Text>
                  </View>
                  <Text className="flex-1 text-gray-600 text-base font-medium leading-6">
                    식판이 잘려서 찍힌 경우
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="self-stretch gap-[14px]">
            <TouchableOpacity
              onPress={() => {
                if (skipGuide) {
                  void setCameraGuideSkip(true);
                }
                setIsGuideVisible(false);
              }}
            >
              <View className="self-stretch h-12 p-3 bg-[#45B310] rounded-xl justify-center items-center">
                <Text className="text-white text-lg font-medium leading-7">
                  확인했어요
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSkipGuide((prev) => !prev)}
              className="flex-row items-center gap-[5px] self-start"
            >
              <View className="w-7 h-7 items-center justify-center relative">
                <RadioButton width={24} height={24} />
                {skipGuide && (
                  <View className="absolute w-2.5 h-2.5 rounded-full bg-[#45B310]" />
                )}
              </View>
              <Text className="text-gray-500 text-sm font-semibold leading-6">
                다시 보지 않기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <View className="absolute inset-0">{renderCameraContent()}</View>

      <View className="flex-1 px-4 pt-[56px]">
        {/* 헤더 */}
        <View className="py-4 flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold">
              식당 선택하기
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsGuideVisible(true)}>
            <Info />
          </TouchableOpacity>
        </View>

        <View className="flex-1" />
      </View>

      <View className="absolute bottom-0 left-0 right-0 px-4 pb-[56px]">
        <TouchableOpacity
          disabled={isPending}
          onPress={async () => {
            if (!cameraRef.current) return;
            try {
              const photo = await (cameraRef.current as any).takePictureAsync({
                quality: 0.8,
                skipProcessing: false,
              });
              const result = await measure(photo.uri);
              const r = result as {
                addedPoint?: number;
                currentPoint?: number;
                leftoverRatio?: number;
              };
              router.push({
                pathname: "/home/camerasucceeded",
                params: {
                  addedPoint: String(r.addedPoint ?? 0),
                  currentPoint: String(r.currentPoint ?? 0),
                  leftoverRatio: String(r.leftoverRatio ?? 0),
                },
              });
            } catch (e) {
              console.error("잔반 인식 실패:", e);
            }
          }}
        >
          <View className="h-[52px] p-3 bg-green-400 rounded-xl justify-center items-center flex-row gap-2">
            {isPending ? (
              <ActivityIndicator color="#f9fafb" />
            ) : (
              <Text className="text-center text-gray-50 text-lg font-medium leading-7">
                잔반 인식하기
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {isGuideVisible && (
        <Pressable
          className="absolute inset-0 bg-black/40 justify-center items-center"
          onPress={() => setIsGuideVisible(false)}
        >
          <View className="items-center">
            <View style={{ width: guideViewportWidth }}>
              <ScrollView
                horizontal
                bounces={false}
                decelerationRate="fast"
                disableIntervalMomentum
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="start"
                snapToInterval={340}
                onMomentumScrollEnd={handleGuideScrollEnd}
                onScrollBeginDrag={(event: any) => event.stopPropagation?.()}
                contentContainerStyle={{
                  gap: 12,
                  paddingHorizontal: guideHorizontalPadding,
                }}
              >
                {renderGuideFirstPage()}
                {renderGuideSecondPage()}
              </ScrollView>
            </View>

            <View className="mt-5 flex-row justify-center items-center gap-2">
              <View
                className={`w-1.5 h-1.5 rounded-full ${currentGuidePage === 0 ? "bg-lime-600" : "bg-white"}`}
              />
              <View
                className={`w-1.5 h-1.5 rounded-full ${currentGuidePage === 1 ? "bg-lime-600" : "bg-white"}`}
              />
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}
