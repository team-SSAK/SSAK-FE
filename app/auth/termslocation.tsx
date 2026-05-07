import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

export default function TermsLocation() {
  return (
    <View className="flex-1 bg-white px-4 py-[56px]">
      <View className="flex-1 flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-900 text-xl font-semibold leading-8">
            위치정보 허용 접근 동의
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 30 }}
          className="flex-1"
        >
          <Text className="text-slate-900 text-sm font-medium leading-6 font-pretendard">
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제1조(목적)
            </Text>
            {"\n"}본 약관은 회원( 본 약관에 동의한 자를 말합니다. 이하
            "회원"이라고 합니다.)이 싹 (이하"회사"라고 합니다.)이 제공하는
            위치기반 서비스(이하"서비스"라고 합니다)를 이용함에 있어 회사와
            회원의 권리·의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제2조(이용약관의 효력 및 변경)
            </Text>
            {"\n"}① 본 약관은 서비스를 신청한 고객 또는 개인위치정보주체가 본
            약관에 동의하고 회사가 정한 소정의 절차에 따라 서비스의 이용자로
            등록함으로써 효력이 발생합니다.
            {"\n"}② 회원이 온라인에서 본 약관의 "동의하기" 버튼을 클릭하였을
            경우 본 약관의 내용을 모두 읽고 이를 충분히 이해하였으며, 그 적용에
            동의한 것으로 봅니다.
            {"\n"}③ 회사는 위치정보의 보호 및 이용 등에 관한 법률, 콘텐츠산업
            진흥법, 전자상거래 등에서의 소비자보호에 관한 법률, 소비자기본법
            약관의 규제에 관한 법률 등 관련법령을 위배하지 않는 범위에서 본
            약관을 개정할 수 있습니다.
            {"\n"}④ 회사가 약관을 개정할 경우에는 적용일자, 개정사유, 현행약관
            및 개정약관의 내용과 개정약관 적용일까지 동의 또는 거부의 의사표시를
            하지 아니하면 개정약관에 동의한 것으로 본다는 내용을 각 명시하여
            다음과 같은 방법으로 게시 및 통지합니다.
            {"\n"}1. 서비스 홈페이지 등 게시 : 개정약관 적용일 30일 전부터
            적용일 이후 상당한 기간(다음 개정 전까지 게시)
            {"\n"}2. 회원에게 전자적 형태(전자우편, SMS 등)로 개별 통지 :
            개정약관 적용일로부터 30일 전{"\n"}⑤ 회사의 전항에 따른 게시 및 통지
            후에도 회원이 개정약관 적용일까지 개정약관에 대해 동의 또는 거부의
            의사표시를 하지 않을 때에는 회원이 해당 개정약관에 동의한 것으로
            봅니다.
            {"\n"}⑥ 회원이 개정약관에 동의하지 않을 경우 (회사 또는) 회원은
            이용계약을 해지할 수 있습니다. 이 때, 회사는 계약해지로 인하여
            회원이 입은 손해를 배상합니다.
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제3조(약관 외 준칙)
            </Text>
            {"\n"}본 약관에 규정되지 않은 사항에 대해서는 위치정보의 보호 및
            이용 등에 관한 법률 (이하 "위치 정보법"이라고 합니다),
            전기통신사업법, 정보통신망 이용촉진 및 보호 등에 관한 법률( 이하
            "정보통신망법"이라고 합니다), 개인정보보호법 등 관련법령 또는 회사가
            정한 서비스의 운영정책 및 규칙 등 (이하 "세부지침"이라고 합니다)의
            규정에 따릅니다
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제4조(서비스의 가입)
            </Text>
            {"\n"}① 회원은 본 약관에 동의하고 서비스에 가입신청함으로써 서비스의
            이용자가 될 수 있습니다.
            {"\n"}② 회사는 아래와 같은 경우 회원의 서비스 가입신청에 대한 승낙을
            유보할 수 있습니다.
            {"\n"}실명이 아니거나 다른 사람의 명의를 사용하는 등 허위로 신청하는
            경우
            {"\n"}회원 등록 사항을 빠뜨리거나 잘못 기재하여 신청하는 경우
            {"\n"}기타 회사가 정한 이용신청 요건을 충족하지 않았을 경우
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제5조(서비스의 해지)
            </Text>
            {"\n"}회원이 서비스 이용을 해지하고자 할 경우 회원은 회사가 정한
            절차 (서비스 홈페이지 등을 통해 공지합니다) 를 통해 서비스 해지를
            신청할 수 있으며, 회사는 법령이 정하는 바에 따라 신속히 처리합니다.
            {"\n"}① 회사는 아래 각 호의1에 해당하는 사유가 발생한 경우에는
            회원의 서비스 이용을 제한하거나 중지시킬 수 있습니다.
            {"\n"}1.회원이 회사 서비스의 운영을 고의 또는 중과실로 방해하는 경우
            {"\n"}2. 서비스용 설비 점검, 보수 또는 공사로 인하여 부득이한 경우
            {"\n"}3. 전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를
            중지했을 경우
            {"\n"}4. 국가비상사태, 서비스 설비의 장애 또는 서비스 이용의 폭주
            등으로 서비스 이용에 지장이 있는 때{"\n"}5. 기타 중대한 사유로
            인하여 회사가 서비스 제공을 지속하는 것이 부적당하다고 인정하는 경우
            {"\n\n"}
            <Text className="text-slate-900 text-base font-semibold leading-6 font-pretendard">
              제6조(서비스의 내용)
            </Text>
            {"\n"}① 서비스의 이용은 연중무휴 1일 24시간 원칙으로 합니다. 단,
            회사의 업무 또는 기술상이 이유로 서비스가 일시 중지될 수 있으며,
            운영상의 목적으로 회사가 정한 기간에도 서비스는 일시 중지될 수
            있습니다 이때 회사는 사전 또는 사후에 이를 공지합니다.
            {"\n"}② 회사는 단말기의 설정 상태에 따라, 회원이 앱을 구동 내지
            사용하는 특정 시점 혹은 회원이 앱 내 특정 서비스를 활성화하거나
            동네인증 등의 액션을 하는 시점에, 위치정보사업자로부터 위치정보를
            위경도 좌표의 형식으로 직접 전달받거나, 이용자가 입력 또는 업로드한
            콘텐츠에 포함된 위치정보를 수집할 수 있습니다. 회사는 해당
            위치정보를 사전에 정의된 특정 구역 단위 또는 특정 행정동 단위에
            속하는지 여부에 대한 값으로 변환하여 활용할 수 있습니다.
            {"\n"}③ 회사가 이러한 위치정보를 토대로 제공하는 서비스의 종류와
            내용은 아래와 같습니다. 다만 회사는 경영상, 사업상 이유 등으로 아래
            예시한 서비스 중 일부를 중단 내지 변경할 수 있으며, 이에 대해서는
            관련 법령 및 본 약관이 정하는 바에 따라 조치하겠습니다.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}
