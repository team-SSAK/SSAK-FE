import { router } from "expo-router";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import ChevronRightG from "../../assets/images/chevron-right-darkgray.svg";
import { MOCK_PROFILE } from "../../constants/mock-data";

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

export default function Setting() {
  const [logoutVisible, setLogoutVisible] = useState(false);

  return (
    <View className="flex-1 bg-[#ffffff] justify-between px-4 py-[56px]">
      <View className="flex flex-col">
        <View className="py-4 flex-row gap-2 justify-start items-center mb-1">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="self-stretch text-gray-800 text-xl font-semibold leading-8">
            설정
          </Text>
        </View>

        <View className="flex flex-col gap-2.5">
          {/*이메일*/}
          <View className="flex flex-col gap-1 py-3.5 px-[19] bg-gray-50 rounded-lg">
            <Text className="text-gray-500 text-xs font-semibold leading-5">
              이메일
            </Text>
            <Text className="text-gray-700 font-medium leading-6">
              {MOCK_PROFILE.email}
            </Text>
          </View>
          {/*알림 설정*/}
          <TouchableOpacity
            onPress={() => router.push("/mypage/notification")}
            className="flex flex-row justify-between py-3.5 px-[19] bg-gray-50 rounded-lg"
          >
            <Text className="text-gray-700 font-medium leading-6">
              알림 설정
            </Text>
            <ChevronRightG />
          </TouchableOpacity>

          <View className="bg-gray-50 rounded-lg overflow-hidden">
            {/*이용약관*/}
            <TouchableOpacity className="flex flex-row px-4 py-3.5 border-b border-white inline-flex justify-between items-center gap-2.5">
              <Text className="text-gray-700 font-medium leading-6">
                이용약관
              </Text>
              <ChevronRightG />
            </TouchableOpacity>
            {/*FAQ*/}
            <TouchableOpacity
              onPress={() => router.push("/mypage/faq")}
              className="flex flex-row px-4 py-3.5 border-b border-white inline-flex justify-between items-center gap-2.5"
            >
              <Text className="text-gray-700 font-medium leading-6">FAQ</Text>
              <ChevronRightG />
            </TouchableOpacity>
            {/*1:1 문의하기*/}
            <TouchableOpacity className="flex flex-row px-4 py-3.5 inline-flex justify-between items-center gap-2.5">
              <Text className="text-gray-700 font-medium leading-6">
                1:1 문의하기
              </Text>
              <ChevronRightG />
            </TouchableOpacity>
          </View>

          {/*로그아웃*/}
          <TouchableOpacity
            onPress={() => setLogoutVisible(true)}
            className="flex flex-row justify-between py-3.5 px-[19] bg-gray-50 rounded-lg"
          >
            <Text className="text-gray-700 font-medium leading-6">
              로그아웃
            </Text>
            <ChevronRightG />
          </TouchableOpacity>
          {/*회원탈퇴*/}
          <TouchableOpacity
            onPress={() => router.push("/mypage/deleteaccount")}
            className="flex flex-row justify-between py-3.5 px-[19] bg-gray-50 rounded-lg"
          >
            <Text className="text-red-500 font-medium leading-6">회원탈퇴</Text>
            <ChevronRightG />
          </TouchableOpacity>
        </View>
      </View>

      <Popup
        visible={logoutVisible}
        title="로그아웃"
        description="로그아웃 하시겠습니까?"
        onCancel={() => setLogoutVisible(false)}
        onConfirm={() => {
          setLogoutVisible(false);
          router.replace("/auth/landing");
        }}
      />
    </View>
  );
}
