import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Heart from "../../assets/images/heart.svg";
import mockdiscription from "../../assets/images/mockdiscription.png";
import AlertPopup from "../../components/alertpopup";
import { postCouponWish } from "../../src/services/mypage/coupons.service";

type TabType = "상품설명" | "상세정보";
const TABS: TabType[] = ["상품설명", "상세정보"];

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <View className="flex-row mx-[-16px]">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            className={`flex-1 p-2.5 justify-center items-center border-b ${
              isActive ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                isActive ? "text-slate-800" : "text-slate-300"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const EMPTY_MESSAGES: Record<TabType, string> = {
  상품설명: "상품 설명이 없습니다",
  상세정보: "상세 정보가 없습니다",
};

interface VerificationCodePopupProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const VerificationCodePopup = ({
  visible,
  value,
  onChangeText,
  onCancel,
  onConfirm,
}: VerificationCodePopupProps) => {
  const isValidCode = value.trim().length === 6;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/10 justify-center items-center px-6">
        <View className="self-center p-5 bg-white rounded-[20px] max-w-full">
          <View>
            <Text className="text-gray-800 text-lg font-semibold leading-7">
              쿠폰 사용 인증번호를 입력해주세요
            </Text>
          </View>

          <View className="mt-[10px] self-stretch p-4 bg-gray-50 rounded-lg flex-col justify-start items-start gap-2.5">
            <View className="self-stretch flex-row justify-start items-center">
              <View className="flex-1 flex-row justify-start items-center gap-2.5">
                <TextInput
                  value={value}
                  onChangeText={onChangeText}
                  placeholder="6자리 번호를 입력해주세요"
                  keyboardType="number-pad"
                  maxLength={6}
                  className="flex-1 text-gray-800 text-base font-medium leading-6 p-0"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-gray-400 text-sm font-medium leading-6">
              - 결제 시 직원에게 번호 입력을 요청해주세요
            </Text>
            <Text className="text-gray-400 text-sm font-medium leading-6">
              - 부정 사용 시 이용이 제한될 수 있습니다
            </Text>
          </View>

          <View className="mt-[18px] flex-row gap-2">
            <TouchableOpacity
              onPress={onCancel}
              className="w-[90px] h-10 bg-slate-100 rounded-[10px] justify-center items-center"
            >
              <Text className="text-slate-800 text-base font-medium leading-6">
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!isValidCode) {
                  return;
                }

                onConfirm();
              }}
              className={`flex-1 h-10 rounded-[10px] justify-center items-center ${
                isValidCode ? "bg-green-400" : "bg-gray-500"
              }`}
            >
              <Text className="text-white text-base font-medium leading-6">
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Coupon() {
  const {
    couponId,
    image: couponImage,
    storeName,
    title,
    price,
  } = useLocalSearchParams<{
    couponId?: string;
    image?: string;
    storeName?: string;
    title?: string;
    price?: string;
  }>();
  const [activeTab, setActiveTab] = useState<TabType>("상품설명");
  const [showExchangePopup, setShowExchangePopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showUseDonePopup, setShowUseDonePopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isWished, setIsWished] = useState(true);

  const couponIdValue = useMemo(() => {
    const rawCouponId = Array.isArray(couponId) ? couponId[0] : couponId;
    return Number(rawCouponId);
  }, [couponId]);

  const handleToggleWish = async () => {
    const previous = isWished;
    setIsWished(!previous);

    if (Number.isNaN(couponIdValue)) {
      return;
    }

    try {
      await postCouponWish(couponIdValue);
    } catch (error) {
      setIsWished(previous);
      console.error("쿠폰 찜하기 실패:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 140,
        }}
      >
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">
            내 쿠폰 상세
          </Text>
        </View>

        <View
          className="bg-slate-100 overflow-hidden mb-4 mx-[-16px]"
          style={{ aspectRatio: 1 }}
        >
          {couponImage ? (
            <Image
              source={couponImage}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              contentPosition="center"
            />
          ) : null}
        </View>

        <View className="flex flex-col mt-4">
          <Text className="text-[#7E7E7E] text-sm font-semibold leading-6">
            {storeName ?? "가게이름"}
          </Text>
          <Text className="text-black text-xl font-semibold leading-8">
            {title ?? "쿠폰 제목"}
          </Text>
          <Text className="text-black text-2xl font-semibold leading-10">
            {price ?? "0P"}
          </Text>
        </View>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <View className="pt-[42px] pb-[84px] flex-1 items-center">
          {activeTab === "상품설명" ? (
            <Image
              source={mockdiscription}
              style={{ width: "100%", aspectRatio: 375 / 1718 }}
              contentFit="contain"
              contentPosition="top"
            />
          ) : (
            <View className="w-full pt-[42px] pb-[90px] gap-[40px]">
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  사용 방법
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 결제 시 직원에게 쿠폰 사용 의사를 전달해주세요.{"\n"}-
                  직원이 인증번호를 입력하면 사용이 완료됩니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  사용 조건
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 일부 매장에서 사용이 제한될 수 있습니다.{"\n"}- 타 할인 및
                  이벤트와 중복 사용이 불가할 수 있습니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  유효기간
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 발급일로부터 60일 이내 사용 가능합니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  사용 방법
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 결제 시 직원에게 쿠폰 사용 의사를 전달해주세요.{"\n"}-
                  직원이 인증번호를 입력하면 사용이 완료됩니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  유의사항
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 사용 후 쿠폰은 재사용이 불가능합니다.{"\n"}- 환불 및
                  재발급이 불가합니다.
                </Text>
              </View>
              <View className="flex flex-col">
                <Text className="text-gray-500 text-base font-semibold leading-6">
                  인증 안내
                </Text>
                <Text className="text-gray-700 text-base font-medium leading-6">
                  - 매장에서 인증번호 입력 받아야 쿠폰이 적용됩니다.
                </Text>
              </View>
              <View className="flex flex-col gap-[5px] mt-[28px] items-center">
                <Text className="text-gray-800 font-semibold leading-6">
                  도움말을 통해 문제를 해결하지 못하셨나요?
                </Text>
                <Text className="text-center text-gray-500 text-sm font-semibold underline leading-6">
                  Seeders Lab에 직접 문의하기
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-4 pt-[14px] pb-[56px] bg-white">
        <View className="w-full flex-row gap-[11px]">
          <TouchableOpacity onPress={handleToggleWish}>
            <View className="w-14 h-[52px] p-3 bg-gray-100 rounded-xl justify-center items-center">
              {isWished ? <HeartFilled /> : <Heart />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1"
            onPress={() => setShowExchangePopup(true)}
          >
            <View className="w-full h-[52px] p-3 bg-green-400 rounded-xl justify-center items-center">
              <Text className="text-center text-gray-50 text-lg font-medium leading-7">
                사용하기
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <AlertPopup
        visible={showExchangePopup}
        title="쿠폰을 사용하시겠습니까?"
        description="사용 시 쿠폰은 소멸됩니다"
        onCancel={() => setShowExchangePopup(false)}
        onConfirm={() => {
          setShowExchangePopup(false);
          setTimeout(() => setShowVerificationPopup(true), 150);
        }}
        cancelText="취소"
        confirmText="사용하기"
      />

      <VerificationCodePopup
        visible={showVerificationPopup}
        value={verificationCode}
        onChangeText={setVerificationCode}
        onCancel={() => {
          setShowVerificationPopup(false);
          setVerificationCode("");
        }}
        onConfirm={() => {
          setShowVerificationPopup(false);
          setVerificationCode("");
          setTimeout(() => setShowUseDonePopup(true), 150);
        }}
      />

      <AlertPopup
        visible={showUseDonePopup}
        title="쿠폰 사용 완료"
        description="쿠폰이 성공적으로 사용되었습니다"
        onConfirm={() => setShowUseDonePopup(false)}
        confirmText="확인"
      />
    </View>
  );
}
