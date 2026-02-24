import { router } from "expo-router";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import { Toggle } from "../../components/toggle";

function Popup({
  title = "로그아웃",
  description = "로그아웃 하시겠습니까?",
  onCancel,
  onConfirm,
  visible = false,
}: {
  title?: string;
  description?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  visible?: boolean;
}) {
  return (
    <Modal transparent visible={visible}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-72 p-5 bg-white rounded-[20px] flex-col justify-center items-center gap-4">
          <View className="self-stretch flex-col justify-start items-start gap-1">
            <Text className="self-stretch text-slate-800 text-lg font-semibold leading-7">
              {title}
            </Text>
            <Text className="self-stretch text-slate-500 text-sm font-medium leading-6">
              {description}
            </Text>
          </View>

          <View className="self-stretch flex-row justify-start items-center gap-2">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 h-10 px-2 py-2 bg-slate-100 rounded-[10px] justify-center items-center"
            >
              <Text className="text-slate-800 text-base font-medium leading-6">
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 h-10 px-2 py-2 bg-lime-600 rounded-[10px] justify-center items-center"
            >
              <Text className="text-white text-base font-medium leading-6">
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function Notification() {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [communityOn, setCommunityOn] = useState(true);
  const [eventOn, setEventOn] = useState(true);
  const [nightOn, setNightOn] = useState(true);

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-7">
          <TouchableOpacity onPress={() => router.push("/auth/landing")}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
            알림 설정
          </Text>
        </View>

        <View className="flex flex-col gap-2.5">
          <Text className="text-gray-800 font-semibold leading-6">
            서비스 알림
          </Text>
          <View className="flex flex-row  justify-between py-3.5 px-4 bg-gray-50 rounded-lg">
            <Text className="text-gray-700 font-medium leading-6">
              커뮤니티 알림
            </Text>
            <Toggle value={communityOn} onChange={setCommunityOn} />
          </View>
          <View className="h-[18px]" />
          <Text className="text-gray-800 font-semibold leading-6">
            마케팅 정보 수신
          </Text>
          <View className="flex flex-row  justify-between py-3.5 px-4 bg-gray-50 rounded-lg">
            <Text className="text-gray-700 font-medium leading-6">
              이벤트 및 혜택 알림
            </Text>
            <Toggle value={eventOn} onChange={setEventOn} />
          </View>
          <View className="flex flex-row  justify-between py-3.5 px-4 bg-gray-50 rounded-lg">
            <Text className="text-gray-700 font-medium leading-6">
              야간 혜택 알림 (21시~8시)
            </Text>
            <Toggle value={nightOn} onChange={setNightOn} />
          </View>
        </View>
      </View>

      <Popup
        visible={logoutVisible}
        title="로그아웃"
        description="로그아웃 하시겠습니까?"
        onCancel={() => setLogoutVisible(false)}
        onConfirm={() => {
          setLogoutVisible(false);
          // 로그아웃 로직
        }}
      />
    </View>
  );
}
