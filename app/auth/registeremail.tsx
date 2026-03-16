import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import TextInput from "../../components/input/textinput";
import StepIndicator from "../../components/stepindicator";
import { useSendEmail } from "../../src/hooks/useSendEmail";

export default function RegisterEmail() {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: sendEmail, isPending } = useSendEmail();

  const isButtonEnabled = email.length > 0 && cooldown === 0 && !isPending;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const onSend = () => {
    setErrorMsg(null);
    sendEmail(
      { email, type: "SIGNUP" },
      {
        onSuccess: () => {
          setCooldown(60); // 60s cooldown
          router.push({
            pathname: "/auth/registerverification",
            params: { email },
          });
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "전송에 실패했습니다.";
          setErrorMsg(msg);
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-10">
          <TouchableOpacity onPress={() => router.push("/auth/landing")}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
            회원가입
          </Text>
        </View>
        <StepIndicator currentStep={0} />
        <Text className="text-green-900 text-2xl font-semibold leading-10 my-3.5">
          이메일을 입력해주세요
        </Text>
        <TextInput
          placeholder="이메일을 입력해주세요"
          onChangeText={setEmail}
          value={email}
        />
        {errorMsg ? (
          <Text className="text-red-600 mt-2">{errorMsg}</Text>
        ) : null}
        {cooldown > 0 ? (
          <Text className="text-gray-500 mt-2">재전송 가능: {cooldown}s</Text>
        ) : null}
      </View>
      <TouchableOpacity disabled={!isButtonEnabled} onPress={onSend}>
        <View
          className="self-stretch h-[52px] p-3 rounded-xl justify-center items-center"
          style={{
            backgroundColor: isButtonEnabled ? "#45B310" : "#94A3B8",
            opacity: isPending ? 0.8 : 1,
          }}
        >
          <Text className="text-center text-white text-lg font-medium leading-7">
            {isPending ? "전송 중..." : "인증 요청"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
