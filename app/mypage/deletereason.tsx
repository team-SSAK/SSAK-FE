import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import AlertPopup from "../../components/alertpopup";
import TextInput from "../../components/input/textinput";
import {
  getWithdrawal,
  postAuthWithdrawal,
  postWithdrawal,
} from "../../src/services/mypage/withdrawal.service";

interface WithdrawalReason {
  wdReasonId: string;
  wdReasonContent: string;
}

export default function DeleteReason() {
  const [reasons, setReasons] = useState<WithdrawalReason[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await getWithdrawal();
        const ordered = [
          ...res.filter((reason) => reason.wdReasonId !== "1"),
          ...res.filter((reason) => reason.wdReasonId === "1"),
        ];
        setReasons(ordered);
      } catch (e) {
        console.log("탈퇴 사유 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchReasons();
  }, []);

  const toggleReason = (id: string) => {
    setSelectedId(id); // 단일 선택
  };

  const isButtonEnabled = !!selectedId;

  const handleWithdraw = () => {
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    setShowPopup(false);
    try {
      setSubmitting(true);
      // 선택된 사유 객체 찾기
      const selectedReason = reasons.find((r) => r.wdReasonId === selectedId);
      const reasonContent =
        selectedId === "1"
          ? customReason.trim()
          : (selectedReason?.wdReasonContent ?? "");
      await postWithdrawal(selectedId, reasonContent);
      await postAuthWithdrawal();
      router.replace("/auth/landing?showPopup=true&type=delete");
    } catch (e) {
      console.log("탈퇴 실패", e);
    } finally {
      setSubmitting(false);
    }
  };

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
          {loading ? (
            <ActivityIndicator />
          ) : (
            reasons.map((reason) => {
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
            })
          )}
        </View>

        <View className="h-2.5" />

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
          disabled={!isButtonEnabled || submitting}
          onPress={handleWithdraw}
          className="flex-1 h-[52px] rounded-xl items-center justify-center"
          style={{
            backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
            opacity: isButtonEnabled ? 1 : 0.5,
          }}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-lg font-medium">탈퇴하기</Text>
          )}
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
