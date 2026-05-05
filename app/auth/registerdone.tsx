import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ChevronRight from "../../assets/images/chevron-right.svg";
import RadioButton from "../../assets/images/radio-button.svg";
import TickCircle from "../../assets/images/tick-circle.svg";

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
          <Checkbox
            label="약관 전체 동의"
            checked={agreeAll}
            onPress={toggleAll}
          />

          <Checkbox
            label="개인정보 수집 및 이용 동의 (필수)"
            checked={agreePrivacy}
            onPress={() => {
              const next = !agreePrivacy;
              setAgreePrivacy(next);
              syncAll(next, agreeLocation, agreeMarketing);
            }}
          />

          <Checkbox
            label="위치정보 허용 접근 동의 (필수)"
            checked={agreeLocation}
            onPress={() => {
              const next = !agreeLocation;
              setAgreeLocation(next);
              syncAll(agreePrivacy, next, agreeMarketing);
            }}
          />

          <Checkbox
            label="Email 및 SNS 광고성 정보 수신동의 (선택)"
            checked={agreeMarketing}
            onPress={() => {
              const next = !agreeMarketing;
              setAgreeMarketing(next);
              syncAll(agreePrivacy, agreeLocation, next);
            }}
          />
        </View>

        <View className="h-[34px]" />

        {/* 가입 버튼 */}
        <TouchableOpacity onPress={() => router.replace("/auth/landing")}>
          <View className="self-stretch h-[52px] p-3 rounded-xl justify-center items-center bg-[#45B310]">
            <Text className="text-center text-white text-lg font-medium leading-7">
              가입 완료
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
