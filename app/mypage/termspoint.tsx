import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function TermsPoint() {
  const sections = [
    {
      title: "제 1 조 (정의)",
      body: `본 장에서 사용하는 용어의 정의는 다음 각 호와 같습니다.
① 서비스 : 회사가 앱을 통해 제공하는 잔반 인증, 포인트 적립, 쿠폰 구매 및 사용 등 제반 서비스를 의미합니다.
② 잔반 인증 : 회원이 식사 후 잔반이 없음을 증명하는 사진이나 영상을 앱에 업로드하여 회사가 정한 기준에 따라 승인을 받는 행위를 말합니다.
③ 싹 포인트 : 잔반 인증 성공 또는 이벤트 참여 등을 통해 회원에게 지급되는 가상의 데이터를 의미하며 앱 내 쿠폰 구매 시 결제 수단으로 사용됩니다.
④ 쿠폰 : 회원이 보유한 포인트를 사용하여 교환하거나 구매할 수 있는 모바일 상품권, 할인권, 교환권 등을 의미합니다.
⑤ 제휴처 : 회사와 계약을 체결하여 앱 내에서 사용 가능한 쿠폰을 공급하거나 실제 서비스를 제공하는 지역 상점 및 외부 업체를 말합니다.
⑥ 포인트 적립 : 회원이 회사가 제시한 인증 조건이나 미션을 완수했을 때 정해진 수량의 포인트가 계정에 부여되는 것을 의미합니다.
⑦ 쿠폰 구매 : 회원이 적립된 포인트를 차감하여 특정 제휴처의 쿠폰으로 교환하는 행위를 말합니다.`,
    },
    {
      title: "제 2 조 (잔반 인증 및 포인트 적립)",
      body: `① 회원은 회사가 앱 내에 공지한 인증 가이드라인에 따라 식사 후 빈 식판 사진을 촬영하여 전송해야 합니다.
② 회사는 AI 판독 시스템 또는 운영자 검수를 통해 인증의 적절성을 판단하며 승인된 경우에 한하여 즉시 또는 정해진 기한 내에 포인트를 적립합니다.
③ 타인의 사진 도용, 동일 사진 재사용, 잔반을 가리고 촬영하는 등 부정한 방법으로 인증을 시도할 경우 적립이 취소되거나 이미 지급된 포인트가 환수될 수 있습니다.`,
    },
    {
      title: "제 3 조 (포인트의 이용 및 유효기간)",
      body: `① 포인트는 회사에서 정한 쿠폰 구매 및 서비스 내 혜택 이용을 위해서만 사용할 수 있으며 어떠한 경우에도 현금으로 환불되거나 인출될 수 없습니다.
② 포인트의 유효기간은 적립일로부터 1년을 원칙으로 하며 유효기간이 경과한 포인트는 별도 통지 없이 매월 말일에 자동 소멸됩니다.
③ 회원 탈퇴 시 잔여 포인트는 즉시 소멸되며 탈퇴 후 재가입하더라도 이전 포인트는 복구되지 않습니다.`,
    },
    {
      title: "제 4 조 (쿠폰의 구매 및 사용)",
      body: `① 회원은 본인이 보유한 포인트 범위 내에서 원하는 쿠폰을 선택하여 구매할 수 있으며 구매 확정 시 해당 포인트는 즉시 차감됩니다.
② 구매한 쿠폰의 사용 방법, 유효기간, 사용 가능 매장 등은 각 쿠폰 상세 페이지에 명시된 기준을 따릅니다.
③ 쿠폰은 제휴처의 사정에 따라 조기 품절되거나 변경될 수 있으며 이 경우 회사는 유사한 가치의 다른 쿠폰으로 대체하거나 포인트를 환불할 수 있습니다.`,
    },
    {
      title: "제 5 조 (쿠폰의 취소 및 환불)",
      body: `① 포인트를 사용하여 구매한 쿠폰은 유효기간 내에만 취소가 가능하며 취소 시 사용된 포인트는 다시 반환됩니다.
② 쿠폰을 이미 사용하였거나 유효기간이 경과한 경우 또는 상품 특성상 취소가 불가능하다고 명시된 경우에는 포인트 반환이 되지 않습니다.
③ 제휴처의 폐업이나 계약 종료 등 회사의 귀책사유로 쿠폰 사용이 불가능해진 경우 회사는 사용된 포인트를 전액 환불합니다.`,
    },
    {
      title: "제 6 조 (책임의 제한)",
      body: `① 회사는 제휴처가 제공하는 쿠폰 상품의 품질이나 서비스 자체에 대해서는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
① 회원이 쿠폰을 타인에게 양도하거나 매매하여 발생하는 분쟁에 대하여 회사는 개입하지 않으며 그 책임은 회원 본인에게 있습니다.`,
    },
    {
      title: "부칙",
      body: `본 약관은 2026년 5월 10일부터 시행합니다.
이용약관은 싹 어플 서비스 내에서 확인할 수 있습니다.`,
    },
  ];

  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      <View className="flex-1 flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-900 text-xl font-semibold leading-8">
            포인트 및 쿠폰 이용약관
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 30 }}
          className="flex-1"
        >
          {sections.map((section) => (
            <View key={section.title} className="mb-6">
              <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
                {section.title}
              </Text>
              <Text className="text-gray-900 text-sm font-medium leading-6 font-pretendard">
                {"\n"}
                {section.body}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
