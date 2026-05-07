import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import ChevronRight from "../../assets/images/chevron-right.svg";
import RadioButton from "../../assets/images/radio-button.svg";
import TickCircle from "../../assets/images/tick-circle.svg";
import {
  createSocialUserDetails,
  signup,
} from "../../src/services/auth/signup.service";
import { clearSocialLoginPending } from "../../src/utils/storage";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

function Checkbox({ label, checked, onPress }: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="self-stretch flex-row justify-between items-center"
      activeOpacity={0.7}
    >
      <View className="flex-1 h-6 flex-row items-center gap-[5px]">
        {checked ? (
          <TickCircle width={24} height={24} />
        ) : (
          <RadioButton width={24} height={24} />
        )}

        <Text className="h-6 text-slate-400 text-base font-medium leading-6">
          {label}
        </Text>
      </View>

      <ChevronRight width={24} height={24} />
    </TouchableOpacity>
  );
}

export default function RegisterDone() {
  const params = useLocalSearchParams();

  const email = typeof params.email === "string" ? params.email : "";
  const password = typeof params.password === "string" ? params.password : "";
  const name = typeof params.name === "string" ? params.name : "";
  const [isStoredSocialLogin, setIsStoredSocialLogin] = useState(false);
  const isSocialLogin = params.socialLogin === "true" || isStoredSocialLogin;

  const [submitting, setSubmitting] = useState(false);

  /* -----------------------------
     약관 상태
  ----------------------------- */
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeLocation, setAgreeLocation] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const toggleAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreePrivacy(next);
    setAgreeLocation(next);
    setAgreeMarketing(next);
  };

  const syncAll = (privacy: boolean, location: boolean, marketing: boolean) => {
    setAgreeAll(privacy && location && marketing);
  };

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      {/* 상단 환영 영역 */}
      <View className="flex flex-col mt-[84px]">
        <View className="flex flex-col gap-3 justify-center items-center">
          <Text className="text-green-400 text-sm font-medium leading-6">
            싹 비우고, 싹 틔우다
          </Text>
          <Text className="text-green-500 text-7xl font-normal leading-[79.10px]">
            싹
          </Text>
        </View>

        <Text className="self-stretch text-center text-gray-700 text-lg font-medium leading-7 mt-4">
          {name ? `${name}님 환영합니다!` : "환영합니다!"}
        </Text>
      </View>

      {/* 약관 영역 */}
      <View className="flex flex-col">
        <View className="flex flex-col gap-4">
          <View className="self-stretch flex-row justify-between items-center">
            <TouchableOpacity
              onPress={toggleAll}
              className="h-6 w-6 justify-center items-center"
              activeOpacity={0.7}
            >
              {agreeAll ? (
                <TickCircle width={24} height={24} />
              ) : (
                <RadioButton width={24} height={24} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/auth/terms")}
              className="flex-1 h-6 flex-row justify-between items-center ml-[5px]"
              activeOpacity={0.7}
            >
              <Text className="h-6 text-slate-400 text-base font-medium leading-6">
                약관 전체 동의
              </Text>
              <ChevronRight width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View className="self-stretch flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => {
                const next = !agreePrivacy;
                setAgreePrivacy(next);
                syncAll(next, agreeLocation, agreeMarketing);
              }}
              className="h-6 w-6 justify-center items-center"
              activeOpacity={0.7}
            >
              {agreePrivacy ? (
                <TickCircle width={24} height={24} />
              ) : (
                <RadioButton width={24} height={24} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/auth/termspersonalinfo")}
              className="flex-1 h-6 flex-row justify-between items-center ml-[5px]"
              activeOpacity={0.7}
            >
              <Text className="h-6 text-slate-400 text-base font-medium leading-6">
                개인정보 수집 및 이용 동의 (필수)
              </Text>
              <ChevronRight width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View className="self-stretch flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => {
                const next = !agreeLocation;
                setAgreeLocation(next);
                syncAll(agreePrivacy, next, agreeMarketing);
              }}
              className="h-6 w-6 justify-center items-center"
              activeOpacity={0.7}
            >
              {agreeLocation ? (
                <TickCircle width={24} height={24} />
              ) : (
                <RadioButton width={24} height={24} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/auth/termslocation")}
              className="flex-1 h-6 flex-row justify-between items-center ml-[5px]"
              activeOpacity={0.7}
            >
              <Text className="h-6 text-slate-400 text-base font-medium leading-6">
                위치정보 허용 접근 동의 (필수)
              </Text>
              <ChevronRight width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View className="self-stretch flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => {
                const next = !agreeMarketing;
                setAgreeMarketing(next);
                syncAll(agreePrivacy, agreeLocation, next);
              }}
              className="h-6 w-6 justify-center items-center"
              activeOpacity={0.7}
            >
              {agreeMarketing ? (
                <TickCircle width={24} height={24} />
              ) : (
                <RadioButton width={24} height={24} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/auth/termsad")}
              className="flex-1 h-6 flex-row justify-between items-center ml-[5px]"
              activeOpacity={0.7}
            >
              <Text className="h-6 text-slate-400 text-base font-medium leading-6">
                Email 및 SNS 광고성 정보 수신동의 (선택)
              </Text>
              <ChevronRight width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-[34px]" />

        {/* 가입 버튼 */}
        <TouchableOpacity
          disabled={!agreePrivacy || !agreeLocation || submitting}
          onPress={async () => {
            if (!agreePrivacy || !agreeLocation) return;
            try {
              setSubmitting(true);
              if (isSocialLogin) {
                await createSocialUserDetails(name, agreeMarketing);
              } else {
                await signup({
                  userEmail: email,
                  userPw: password,
                  userNm: name,
                  marketAgreeYn: agreeMarketing,
                });
              }
              await clearSocialLoginPending();
              router.replace("/auth/landing");
            } catch (e) {
              console.log("가입 실패", e);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <View
            className="self-stretch h-[52px] p-3 rounded-xl justify-center items-center"
            style={{
              backgroundColor:
                agreePrivacy && agreeLocation ? "#45B310" : "#94A3B8",
              opacity: agreePrivacy && agreeLocation ? 1 : 0.5,
            }}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center text-white text-lg font-medium leading-7">
                가입 완료
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
