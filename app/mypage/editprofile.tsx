import { router } from "expo-router";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Avatar from "../../assets/images/avatar.svg";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import EditBtn from "../../assets/images/editbtn.svg";
import TextInput from "../../components/input/textinput";
import { MOCK_PROFILE } from "../../constants/mock-data";

function Popup({
  title = "변경사항 미저장",
  description = "지금 나가면 수정한 내용이 사라집니다",
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
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-72 p-5 bg-white rounded-[20px] gap-4">
          <View className="gap-1">
            <Text className="text-slate-800 text-lg font-semibold leading-7">
              {title}
            </Text>
            <Text className="text-slate-500 text-sm font-medium leading-6">
              {description}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 h-10 bg-slate-100 rounded-[10px] justify-center items-center"
            >
              <Text className="text-slate-800 text-base font-medium leading-6">
                취소
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 h-10 bg-lime-600 rounded-[10px] justify-center items-center"
            >
              <Text className="text-white text-base font-medium leading-6">
                나가기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
      <Popup
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          router.replace("/mypage/main");
        }}
      />
    </View>
  );
}
