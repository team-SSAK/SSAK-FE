import TextInput from "@/components/input/textinput";
import PopUp from "@/components/popup";
import StepIndicator from "@/components/stepindicator";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import { useSendEmail } from "../../src/hooks/useSendEmail";
import { useVerifyEmail } from "../../src/hooks/useVerifyEmail";

type PopupType = "INITIAL" | "CODE_MISMATCH" | "CODE_EXPIRED" | null;

export default function RegisterVerification() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [verificationCode, setVerificationCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  // 팝업을 텍스트가 아니라 타입으로 관리
  const [popupType, setPopupType] = useState<PopupType>(null);

  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const { mutate: sendEmail, isPending: isSendPending } = useSendEmail();
  const isButtonEnabled = verificationCode.length > 0 && !isPending;

  // 화면 진입 시 안내 팝업
  useEffect(() => {
    setPopupType("INITIAL");
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const onVerify = () => {
    if (!email) return;

    setErrorMsg(null);

    verifyEmail(
      {
        email,
        code: verificationCode,
        type: "SIGNUP",
      },
      {
        onSuccess: () => {
          router.push({
            pathname: "/auth/registerpw",
            params: { email },
          });
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "인증에 실패했습니다.";

          // 인증번호 틀림
          if (msg.includes("인증번호가 일치하지")) {
            setPopupType("CODE_MISMATCH");
            return;
          }

          // ✅ 만료
          if (msg.includes("유효시간") || msg.includes("만료")) {
            setPopupType("CODE_EXPIRED");
            return;
          }

          // 기타 에러만 빨간 글씨
          setErrorMsg(msg);
        },
      },
    );
  };

  const onResend = () => {
    if (!email) return;

    setErrorMsg(null);
    sendEmail(
      { email, type: "SIGNUP" },
      {
        onSuccess: () => {
          setCooldown(60); // 60s cooldown
          setPopupType("INITIAL"); // 재요청 성공 시 팝업 띄우기
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "재전송에 실패했습니다.";
          setErrorMsg(msg);
        },
      },
    );
  };

  // 여기서 팝업 텍스트 수정
  const popupText = {
    INITIAL: {
      title: "인증번호가 발송되었습니다",
      message: "전송된 메일이 안보일 시 스팸메일함을 확인해주세요",
    },
    CODE_MISMATCH: {
      title: "인증번호가 일치하지 않습니다",
      message: "입력된 인증번호가 일치한지 확인해주세요",
    },
    CODE_EXPIRED: {
      title: "인증 유효시간이 만료되었습니다",
      message: "화면하단 메일 재요청 버튼을 눌러주세요",
    },
  };

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
          <TouchableOpacity
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.push("/auth/registeremail")
            }
          >
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">회원가입</Text>
        </View>

        <StepIndicator currentStep={1} />

        <Text className="text-green-900 text-2xl font-semibold my-3.5">
          메일로 온 인증번호를 입력해주세요
        </Text>

        <TextInput
          placeholder="인증 번호를 입력해주세요"
          onChangeText={setVerificationCode}
          value={verificationCode}
        />

        {errorMsg ? (
          <Text className="text-red-600 mt-2">{errorMsg}</Text>
        ) : null}
      </View>

      <View className="flex flex-col gap-[60px]">
        <View className="flex flex-col gap-3">
          <Text className="text-center text-gray-500 text-xs">
            메일이 오지 않나요?
            <br />
            스팸메일함을 확인해주세요
          </Text>
          <TouchableOpacity
            disabled={cooldown > 0 || isSendPending}
            onPress={onResend}
          >
            <Text className="text-center text-green-500 text-sm underline">
              {isSendPending
                ? "재전송 중..."
                : cooldown > 0
                  ? `재전송 가능: ${cooldown}s`
                  : "메일 재요청"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full flex-row gap-2.5 px-4 py-2.5">
          <TouchableOpacity
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.push("/auth/registeremail")
            }
            className="h-12 px-9 rounded-xl bg-slate-100 items-center justify-center"
          >
            <Text className="text-slate-900 text-lg font-medium">이전</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!isButtonEnabled}
            onPress={onVerify}
            className="flex-1 h-12 rounded-xl items-center justify-center"
            style={{
              backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
              opacity: isButtonEnabled ? 1 : 0.5,
            }}
          >
            <Text className="text-white text-lg font-medium">
              {isPending ? "확인 중..." : "다음"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* popupType 기반 렌더링 */}
      {popupType && (
        <PopUp
          title={popupText[popupType].title}
          message={popupText[popupType].message}
          onClose={() => setPopupType(null)}
        />
      )}
    </View>
  );
}
