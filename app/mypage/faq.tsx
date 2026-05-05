import { router } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronDown from "../../assets/images/chevron-down.svg";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import ChevronUp from "../../assets/images/chevron-up.svg";
import SearchInput from "../../components/searchinput";

const KAKAO_URL = "https://open.kakao.com/o/sBvSiDsi";

function ContactLink({
  className = "text-gray-600 font-medium underline leading-6",
}: {
  className?: string;
}) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(KAKAO_URL)}>
      <Text className={className}>Seeders Lab에 직접 문의하기</Text>
    </TouchableOpacity>
  );
}

type FAQItem = {
  id: string;
  question: string;
  answer: string | React.ReactElement;
};

type FAQCategory = {
  category: string;
  items: FAQItem[];
};

const faqData: FAQCategory[] = [
  {
    category: "포인트 · 쿠폰",
    items: [
      {
        id: "point-1",
        question: "포인트가 지급되지 않았어요.",
        answer: (
          <>
            <Text className="text-gray-700 font-medium leading-6">
              활동 완료 후 포인트는 일정 시간 내 자동으로 지급됩니다.{"\n"}
              네트워크 환경이나 시스템 처리 상황에 따라 지급이 지연될 수 있으니
              잠시 후 다시 확인해 주세요.{"\n"}
              {"\n"}이후에도 지급되지 않는 경우 앱을 재실행하거나 Seeders
              Lab으로 문의해 주세요.{"\n"}
              {"\n"}
            </Text>
            <ContactLink />
          </>
        ),
      },
      {
        id: "coupon-1",
        question: "쿠폰이 교환되지 않아요.",
        answer: (
          <>
            <Text className="text-gray-700 font-medium leading-6">
              쿠폰 교환은 보유 포인트가 충분한 경우에만 가능합니다.{"\n"}또한
              일부 쿠폰은 수량 제한 또는 교환 가능 기간이 있을 수 있습니다.
              {"\n"}
              {"\n"}조건을 다시 확인한 후에도 문제가 발생한다면 앱을
              재실행하거나 Seeders Lab으로 문의해 주세요.{"\n"}
              {"\n"}
            </Text>
            <ContactLink />
          </>
        ),
      },
      {
        id: "coupon-2",
        question: "매장에서 쿠폰 사용이 안돼요.",
        answer: (
          <>
            <Text className="text-gray-700 font-medium leading-6">
              일부 쿠폰은 사용 가능한 매장이 제한되어 있거나 특정 조선에서만
              사용할 수 있습니다.{"\n"}쿠폰 사용 전 쿠폰 상세 화면에서
              &lsquo;사용 가능 매장 및 사용 조건 &rsquo;을 반드시 확인해주세요.
              {"\n"}
              {"\n"}매장에서 사용이 불가능하다고 안내받은 경우 Seeders Lab으로
              문의해 주시면 확인 후 안내해 드리겠습니다.{"\n"}
              {"\n"}
            </Text>
            <ContactLink />
          </>
        ),
      },
    ],
  },
  {
    category: "잔반 인식",
    items: [
      {
        id: "recognition-1",
        question: "잔반 인식이 제대로 되지 않아요.",
        answer: (
          <>
            <Text className="text-gray-700 font-medium leading-6">
              잔반 인식 기능은 조명 환경, 촬영 각도, 음식 상태에 따라 정확도가
              {"\n"}
              달라질 수 있습니다.{"\n"}다음 방법을 시도해 주세요.{"\n"}• 음식이
              화면에 잘 보이도록 가까이 촬영해 주세요.{"\n"}• 밝은 환경에서
              촬영해 주세요.{"\n"}• 접시가 잘리지 않도록 화면 안에 전체가 보이게
              촬영해 주세요.{"\n"}• 접시가 화면 중앙에 위치하도록 맞춰 주세요.
              {"\n"}
              {"\n"}
              {"\n"}이후에도 문제가 지속되면 앱을 재샐행하고나 Seeders Lab으로
              문의해 주세요.{"\n"}
              {"\n"}
            </Text>
            <ContactLink />
          </>
        ),
      },
    ],
  },
  {
    category: "구내식당 · 메뉴",
    items: [
      {
        id: "restaurant-1",
        question: "구내식당이 목록에 보이지 않아요.",
        answer: (
          <>
            <Text className="text-gray-700 font-medium leading-6">
              구내식당 정보는 지역 및 제휴 여부에 따라 표시됩니다.{"\n"}
              현재 서비스가 지원되지 않는 식당일 수 있습니다.{"\n"}
              {"\n"}
              목록이 정상적으로 표시되지 않는 경우 앱을 최신 버전으로 업데이트
              한 후 다시 확인해주세요.{"\n"}
              {"\n"}
            </Text>
            <ContactLink />
          </>
        ),
      },
      {
        id: "restaurant-2",
        question: "메뉴 정보가 업데이트되지 않아요.",
        answer: (
          <>
            <Text className="text-gray-700 font-medium leading-6">
              메뉴 정보는 식당에서 제공한 데이터를 기반으로 주기적으로
              업데이트됩니다.{"\n"}
              일시적인 네트워크 문제로 업데이트가 지연될 수 있습니다.{"\n"}
              {"\n"}
              앱을 새로고침하거나 재실행한 뒤 다시 확인해주세요.{"\n"}
              {"\n"}
            </Text>
            <ContactLink />
          </>
        ),
      },
    ],
  },
  {
    category: "계정 · 앱 이용",
    items: [
      {
        id: "application-1",
        question: "로그인이 되지 않아요.",
        answer: (
          <>
            <Text className="text-gray-700 font-medium leading-6">
              로그인이 되지 않는 경우 다음 사항을 확인해주세요{"\n"}• 입력한
              이메일 또는 계정 정보가 정확한지{"\n"}• 네트워크 연결 상태가
              정상인지{"\n"}
              {"\n"}
              문제가 계속 발생하면 비밀번호 재설정 또는 Seeders Lab으로 문의해
              주세요.{"\n"}
              {"\n"}
            </Text>
            <ContactLink />
          </>
        ),
      },
    ],
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredFaqData = faqData
    .map((category) => ({
      ...category,
      items:
        normalizedQuery.length === 0
          ? category.items
          : category.items.filter((item) =>
              item.question.toLowerCase().includes(normalizedQuery),
            ),
    }))
    .filter((category) => category.items.length > 0);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View className="flex-1 bg-[#ffffff] py-[56px]">
      <View className="px-4 py-4 flex-row gap-2 justify-start items-center mb-1">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft />
        </TouchableOpacity>
        <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
          FAQ
        </Text>
      </View>

      <View className="m-2.5 mb-6">
        <SearchInput
          placeholder="궁금한 점을 검색해보세요."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredFaqData.map((category, categoryIndex) => (
          <View key={categoryIndex} className="flex flex-col">
            <Text className="justify-start text-gray-500 font-semibold leading-6 py-2.5 px-4">
              {category.category}
            </Text>
            {category.items.map((item) => {
              const isOpen = openItems[item.id] || false;
              return (
                <View key={item.id}>
                  <TouchableOpacity
                    onPress={() => toggleItem(item.id)}
                    className={`flex flex-row py-3.5 px-4 justify-between items-center border-b border-gray-50 ${
                      isOpen ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <Text className="justify-start text-gray-700 font-medium leading-6">
                      {item.question}
                    </Text>
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </TouchableOpacity>
                  {isOpen && (
                    <View className="py-5 px-4 self-stretch justify-start bg-gray-50">
                      {typeof item.answer === "string" ? (
                        <Text className="text-gray-700 font-medium leading-6">
                          {item.answer}
                        </Text>
                      ) : (
                        item.answer
                      )}
                    </View>
                  )}
                </View>
              );
            })}
            {/* 카테고리 간 간격 */}
            <View className="h-[30px]" />
          </View>
        ))}
        <View className="flex flex-col gap-[5px] mt-20 items-center">
          <Text className="text-gray-800 font-semibold leading-6">
            도움말을 통해 문제를 해결하지 못하셨나요?
          </Text>
          <ContactLink className="text-center text-gray-500 text-sm font-semibold underline leading-6" />
        </View>
      </ScrollView>
    </View>
  );
}
