import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function TermsPersonalInfo() {
  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      <View className="flex-1 flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-900 text-xl font-semibold leading-8">
            개인정보 수집 및 이용 동의
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 30 }}
          className="flex-1"
        >
          <Text className="text-gray-900 text-sm font-medium leading-6 font-pretendard">
            주식회사 Seederslab(이하 “회사”)은 「개인정보 보호법」 등 관련
            법령에 따라 이용자의 개인정보를 수집·이용하고자 하며, 아래 내용을
            충분히 확인하신 후 동의 여부를 결정하시기 바랍니다.
            {"\n\n"}
            <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
              제1조 (수집하는 개인정보 항목)
            </Text>
            {"\n"}
            회사는 서비스 제공을 위하여 다음과 같은 개인정보를 수집할 수
            있습니다.
            {"\n"}① 회원가입 및 본인 확인 시{"\n"}- 이름
            {"\n"}- 휴대전화번호
            {"\n"}- 이메일 주소
            {"\n"}- 아이디
            {"\n"}- 비밀번호
            {"\n"}② 서비스 이용 및 리워드 제공 시{"\n"}- 이용자 식별정보
            {"\n"}- 잔반 감축 인증 정보
            {"\n"}- 리워드 적립 및 사용 내역
            {"\n"}- 제휴처 이용 내역
            {"\n"}- 접속 로그, 접속 일시, IP 주소, 기기 정보, 쿠키, 서비스 이용
            기록
            {"\n"}③ 고객 문의 및 민원 처리 시{"\n"}- 이름
            {"\n"}- 연락처
            {"\n"}- 이메일 주소
            {"\n"}- 문의 내용
            {"\n"}④ 이벤트 및 경품 제공 시{"\n"}- 이름
            {"\n"}- 연락처
            {"\n"}- 주소
            {"\n"}- 계좌정보 등 지급 관련 정보(필요한 경우에 한함)
            {"\n\n"}
            <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
              제2조 (개인정보의 수집 및 이용 목적)
            </Text>
            {"\n"}
            회사는 수집한 개인정보를 다음 목적 범위 내에서 이용합니다.
            {"\n"}① 회원가입 의사 확인 및 회원 관리
            {"\n"}② 본인 확인 및 부정 이용 방지
            {"\n"}③ 잔반 감축 인증 서비스 제공
            {"\n"}④ 리워드 적립, 지급, 사용 및 정산 처리
            {"\n"}⑤ 제휴 매장 할인, 쿠폰, 포인트 사용 서비스 제공
            {"\n"}⑥ 고객 문의, 민원 처리 및 공지사항 전달
            {"\n"}⑦ 서비스 이용 통계 분석 및 서비스 개선
            {"\n"}⑧ 이벤트, 프로모션 및 혜택 정보 제공
            {"\n"}⑨ 법령상 의무 이행 및 분쟁 대응
            {"\n\n"}
            <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
              제3조 (개인정보의 보유 및 이용 기간)
            </Text>
            {"\n"}
            회사는 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체
            없이 파기합니다. 다만, 관련 법령에 따라 일정 기간 보관이 필요한
            경우에는 아래와 같이 보관할 수 있습니다.
            {"\n"}① 계약 또는 청약철회 등에 관한 기록: 5년
            {"\n"}② 대금결제 및 재화·서비스 공급에 관한 기록: 5년
            {"\n"}③ 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
            {"\n"}④ 서비스 방문 기록 등 접속 로그: 관련 법령에 따른 기간
            {"\n\n"}
            <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
              제4조 (동의 거부 권리 및 불이익)
            </Text>
            {"\n"}
            이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.
            다만, 필수 항목에 대한 동의를 거부할 경우 회원가입, 인증, 리워드
            적립 및 사용 등 서비스의 전부 또는 일부 이용이 제한될 수 있습니다.
            {"\n\n"}
            <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
              제5조 (선택적 개인정보 수집 및 이용)
            </Text>
            {"\n"}
            회사는 맞춤형 혜택 및 마케팅 제공을 위하여 다음 정보를 선택적으로
            수집·이용할 수 있습니다.
            {"\n"}① 수집 항목
            {"\n"}- 마케팅 수신 동의 여부
            {"\n"}- 관심 지역
            {"\n"}- 자주 이용하는 제휴 매장 정보
            {"\n"}- 위치정보(위치기반 서비스 제공 시)
            {"\n"}② 이용 목적
            {"\n"}- 맞춤형 혜택 및 이벤트 정보 제공
            {"\n"}- 이용 패턴 분석을 통한 서비스 개선
            {"\n"}- 지역 기반 제휴 혜택 안내
            {"\n"}③ 보유 기간
            {"\n"}- 동의 철회 시까지
            {"\n"}선택 항목에 동의하지 않더라도 기본적인 서비스 이용에는 제한이
            없습니다.
            {"\n\n"}
            <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
              제6조 (마케팅 정보 수신 동의)
            </Text>
            {"\n"}
            회사는 이메일, 문자메시지, 앱 푸시 등을 통해 이벤트, 혜택, 프로모션
            정보를 발송할 수 있습니다.
            {"\n"}① 수집 항목
            {"\n"}- 휴대전화번호
            {"\n"}- 이메일 주소
            {"\n"}② 이용 목적
            {"\n"}- 이벤트 및 혜택 정보 안내
            {"\n"}- 맞춤형 프로모션 제공
            {"\n"}③ 보유 기간
            {"\n"}- 동의 철회 시까지
            {"\n"}이용자는 언제든지 마케팅 정보 수신 동의를 철회할 수 있습니다.
            {"\n\n"}
            <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
              제7조 (개인정보의 파기)
            </Text>
            {"\n"}
            회사는 개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가
            불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            {"\n"}① 전자적 파일 형태: 복구 또는 재생이 불가능한 방법으로 영구
            삭제
            {"\n"}② 종이 문서 형태: 분쇄 또는 소각
            {"\n\n"}
            <Text className="text-gray-900 text-base font-semibold leading-6 font-pretendard">
              제8조 (기타)
            </Text>
            {"\n"}본 동의서에 명시되지 아니한 사항은 회사의 개인정보처리방침 및
            관련 법령에 따릅니다.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}
