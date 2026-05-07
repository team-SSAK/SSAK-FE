import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function TermsAD() {
  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      <View className="flex-1 flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-900 text-xl font-semibold leading-8">
            Email 및 SNS 광고성 정보 수신동의
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 30 }}
          className="flex-1"
        >
          <Text className="text-slate-900 text-sm font-medium leading-6 font-pretendard">
            주식회사 Seederslab(이하 "회사")은 「개인정보 보호법」, 「정보통신망
            이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령에 따라 이용자에게
            이벤트, 혜택, 프로모션 및 서비스 관련 광고성 정보를 제공하기 위하여
            아래와 같이 광고성 정보 수신 동의를 받고자 합니다.
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제1조 목적
            </Text>
            {"\n"}본 동의서는 회사가 제공하는 싹(SSAK) 서비스와 관련하여
            이용자에게 이벤트, 혜택, 프로모션, 제휴 매장 쿠폰, 리워드 안내 등
            광고성 정보를 이메일, SNS, 문자메시지, 앱 푸시 등의 방법으로
            발송하기 위한 사항을 규정하는 것을 목적으로 합니다.
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제2조 수집 및 이용 항목
            </Text>
            {"\n"}회사는 광고성 정보 발송을 위하여 다음의 정보를 수집·이용할 수
            있습니다.
            {"\n"}① 이메일 주소 ② 휴대전화번호 ③ SNS 계정 정보 또는 SNS 연동
            식별 정보 ④ 마케팅 정보 수신 동의 여부 ⑤ 서비스 이용 기록 및 리워드
            사용 내역 ⑥ 관심 지역, 자주 이용하는 제휴 매장 정보 등 맞춤형 혜택
            제공에 필요한 정보
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제3조 광고성 정보의 이용 목적
            </Text>
            {"\n"}회사는 수집한 정보를 다음의 목적을 위하여 이용합니다.
            {"\n"}① 싹 서비스 관련 이벤트 및 프로모션 안내 ② 리워드, 쿠폰,
            포인트 혜택 안내 ③ 제휴 매장 및 지역 상권 할인 혜택 안내 ④ 신규
            서비스, 기능 업데이트 및 캠페인 정보 안내 ⑤ 이용자 맞춤형 혜택 및
            광고성 정보 제공 ⑥ 환경 캠페인, 잔반 감축 챌린지 등 서비스 참여 유도
            목적의 정보 제공
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제4조 광고성 정보 발송 방법
            </Text>
            {"\n"}회사는 이용자가 동의한 경우 다음의 방법으로 광고성 정보를
            발송할 수 있습니다.
            {"\n"}① 이메일 ② 문자메시지 또는 알림톡 ③ 앱 푸시 알림 ④ SNS 메시지
            또는 SNS 광고 ⑤ 서비스 내 배너, 팝업, 알림 화면
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제5조 보유 및 이용 기간
            </Text>
            {"\n"}회사는 광고성 정보 수신 동의일로부터 이용자가 동의를 철회할
            때까지 관련 정보를 보유 및 이용합니다.
            {"\n"}다만, 관계 법령에 따라 보관이 필요한 경우에는 해당 법령에서
            정한 기간 동안 보관할 수 있습니다.
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제6조 동의 철회 및 수신 거부
            </Text>
            {"\n"}① 이용자는 언제든지 광고성 정보 수신 동의를 철회할 수
            있습니다. ② 수신 거부는 서비스 내 설정 화면, 마이페이지, 이메일 하단
            수신 거부 링크, 고객센터 문의 등의 방법으로 할 수 있습니다. ③
            이용자가 광고성 정보 수신을 거부하더라도 회원가입, 잔반 인증, 포인트
            적립 및 리워드 사용 등 기본적인 서비스 이용에는 제한이 없습니다. ④
            단, 거래 관련 정보, 서비스 이용에 필수적인 공지사항, 약관 변경,
            개인정보 처리 관련 안내 등은 광고성 정보 수신 동의 여부와 관계없이
            발송될 수 있습니다.
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제7조 동의 거부 권리 및 불이익
            </Text>
            {"\n"}이용자는 광고성 정보 수신 동의를 거부할 권리가 있습니다. 다만,
            동의를 거부할 경우 이벤트, 프로모션, 맞춤형 혜택, 제휴 쿠폰 등
            광고성 정보 제공이 제한될 수 있습니다.
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제8조 기타
            </Text>
            {"\n"}본 동의서에 명시되지 않은 사항은 회사의 개인정보처리방침,
            이용약관 및 관련 법령에 따릅니다.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}
