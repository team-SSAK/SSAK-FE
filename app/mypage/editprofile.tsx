import { router } from "expo-router";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Avatar from "../../assets/images/avatar.svg";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import EditBtn from "../../assets/images/editbtn.svg";
import AlertPopup from "../../components/alertpopup";
import TextInput from "../../components/input/textinput";
import { MOCK_PROFILE } from "../../constants/mock-data";

const MAX_LENGTH = 8;

export default function EditProfile() {
  const [inputValue, setInputValue] = useState(MOCK_PROFILE.nickname);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-white justify-between px-4 py-[56px]">
      <View>
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center mb-10">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold leading-8">
            프로필 수정
          </Text>
        </View>

        {/* 프로필 이미지 */}
        <View className="justify-center items-center mb-[11px]">
          <View className="relative w-40 h-40">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-40 h-40 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Avatar width={160} height={160} />
            )}
            <TouchableOpacity className="absolute bottom-0 right-0">
              <EditBtn />
            </TouchableOpacity>
          </View>
        </View>

        {/* 닉네임 */}
        <Text className="text-gray-800 text-sm font-semibold leading-6">
          닉네임
        </Text>
        <View className="h-2" />

        <TextInput
          placeholder="닉네임을 입력해주세요"
          value={inputValue}
          onChangeText={setInputValue}
        />

        <Text className="text-right text-gray-500 text-sm font-medium leading-6">
          {inputValue.length}/{MAX_LENGTH}
        </Text>
      </View>

      {/* 완료 버튼 */}
      <TouchableOpacity
        onPress={() => router.replace("/mypage/main")}
        className="h-[52px] rounded-xl justify-center items-center bg-[#45B310]"
      >
        <Text className="text-white text-lg font-medium leading-7">완료</Text>
      </TouchableOpacity>

      {/* Popup */}
      <AlertPopup
        title="변경사항 미저장"
        description="지금 나가면 수정한 내용이 사라집니다"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          router.replace("/mypage/main");
        }}
        cancelText="취소"
        confirmText="나가기"
      />
    </View>
  );
}
