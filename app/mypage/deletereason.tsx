import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import AlertPopup from "../../components/alertpopup";
import TextInput from "../../components/input/textinput";

interface WithdrawalReason {
  wdReasonId: string;
  wdReasonContent: string;
}

// 디자인QA: 하드코딩 사유 목록
const REASONS: WithdrawalReason[] = [
  { wdReasonId: "2", wdReasonContent: "서비스 이용 빈도가 낙았어요" },
  { wdReasonId: "3", wdReasonContent: "원하는 기능이 없어요" },
  { wdReasonId: "4", wdReasonContent: "개인정보 보호가 우려돼요" },
  { wdReasonId: "5", wdReasonContent: "다른 서비스로 이전할 예정이에요" },
  { wdReasonId: "1", wdReasonContent: "기타" },
];

export default function DeleteReason() {
  const reasons = REASONS;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");

  const toggleReason = (id: string) => setSelectedId(id);

  return (
    <View className="flex-1 bg-white justify-between px-4 py-[56px]">
      <View>
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center mb-5">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-800 text-2xl font-semibold leading-10">
          탈퇴 사유를 선택해주세요.
        </Text>

        <View className="h-7" />

        <View className="gap-[22px]">
          {reasons.map((reason) => {
            const selected = selectedId === reason.wdReasonId;

            return (
              <TouchableOpacity
                key={reason.wdReasonId}
                onPress={() => toggleReason(reason.wdReasonId)}
                className="flex-row gap-3 items-center"
              >
                {selected ? (
                  <View className="w-5 h-5 bg-white rounded-full border-[6px] border-green-400" />
                ) : (
                  <View className="w-5 h-5 bg-white rounded-full border border-gray-400" />
                )}

                <Text className="text-gray-800 font-medium leading-6">
                  {reason.wdReasonContent}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {selectedId === "1" ? (
          <>
            <View className="h-2.5" />
            <TextInput
              placeholder="사유를 입력해주세요"
              value={customReason}
              onChangeText={setCustomReason}
              multiline
            />
          </>
        ) : null}
      </View>

      {/* 하단 버튼 */}
      <View className="flex-row gap-2.5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-[52px] px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/auth/landing")}
          className="flex-1 h-[52px] rounded-xl items-center justify-center bg-[#45B310]"
        >
          <Text className="text-white text-lg font-medium">탈퇴하기</Text>
        </TouchableOpacity>
        <AlertPopup
          visible={showPopup}
          title="탈퇴하시겠습니까?"
          description="회원 탈퇴 시 모아둔 포인트 내역을 복구할 수 없습니다"
          cancelText="취소"
          confirmText="탈퇴하기"
          onCancel={() => setShowPopup(false)}
          onConfirm={handleConfirm}
        />
      </View>
    </View>
  );
}
