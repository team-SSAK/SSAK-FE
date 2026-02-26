import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import { getWithdrawal } from "../../src/services/mypage/withdrawal.service";

interface WithdrawalReason {
  wdReasonId: string;
  wdReasonContent: string;
}

export default function DeleteAccount() {
  const [reasons, setReasons] = useState<WithdrawalReason[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await getWithdrawal();
        setReasons(res);
      } catch (e) {
        console.log("탈퇴 사유 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchReasons();
  }, []);

  const toggleReason = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isButtonEnabled = selectedIds.length > 0;

  const handleNext = () => {
    setLoading(true);
    router.push("/auth/landing?showPopup=true&type=delete");
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-5">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-800 text-2xl font-semibold leading-10">
          탈퇴 사유를 선택해주세요.
        </Text>

        <View className="h-7" />

        <View className="flex-col justify-start items-start gap-[22px]">
          {loading ? (
            <ActivityIndicator />
          ) : (
            reasons.map((reason) => {
              const selected = selectedIds.includes(reason.wdReasonId);

              return (
                <TouchableOpacity
                  key={reason.wdReasonId}
                  onPress={() => toggleReason(reason.wdReasonId)}
                  className="flex-row gap-3 justify-start items-center"
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
      </View>
      <View className="w-full flex-row gap-2.5 px-4 py-2.5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 px-9 rounded-xl bg-slate-100 items-center justify-center"
        >
          <Text className="text-slate-900 text-lg font-medium">이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!isButtonEnabled}
          onPress={handleNext}
          className="flex-1 h-12 rounded-xl items-center justify-center"
          style={{
            backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
            opacity: isButtonEnabled ? 1 : 0.5,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-lg font-medium">탈퇴하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
