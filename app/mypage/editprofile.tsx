import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Avatar from "../../assets/images/avatar.svg";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import AlertPopup from "../../components/alertpopup";
import TextInput from "../../components/input/textinput";
import { useMe } from "../../src/hooks/useMe";

const MAX_LENGTH = 8;

export default function EditProfile() {
  const { me, isLoading, updateMe } = useMe();
  const [inputValue, setInputValue] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pickedProfileImage, setPickedProfileImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!me) {
      return;
    }

    setInputValue(me.userNm);
    setProfileImage(me.userProfileImg ?? null);
    setPickedProfileImage(null);
  }, [me]);

  const trimmedInput = inputValue.trim();
  const initialName = me?.userNm ?? "";
  const initialProfileImage = me?.userProfileImg ?? null;
  const hasImageChanges = profileImage !== initialProfileImage;
  const hasChanges = useMemo(
    () => trimmedInput !== initialName || hasImageChanges,
    [hasImageChanges, initialName, trimmedInput],
  );
  const canSubmit =
    !isLoading && !isSubmitting && trimmedInput.length > 0 && hasChanges;

  const handlePickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("권한 필요", "사진 보관함 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    const ext = (asset.fileName?.split(".").pop() || "jpg").toLowerCase();
    const mime = asset.mimeType || `image/${ext === "jpg" ? "jpeg" : ext}`;
    const name = asset.fileName || `profile.${ext}`;

    setProfileImage(asset.uri);
    setPickedProfileImage({
      uri: asset.uri,
      name,
      type: mime,
    });
  };

  const handleBack = () => {
    if (hasChanges) {
      setIsModalVisible(true);
      return;
    }

    router.back();
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    try {
      setIsSubmitting(true);
      const ok = await updateMe(trimmedInput, pickedProfileImage ?? undefined);
      if (ok) {
        router.replace("/mypage/main");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-between px-4 py-[56px]">
      <View>
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center mb-10">
          <TouchableOpacity onPress={handleBack}>
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
            {/*
            <TouchableOpacity
              className="absolute bottom-0 right-0"
              onPress={handlePickProfileImage}
            >
              <EditBtn />
            </TouchableOpacity>
            */}
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
          onChangeText={(text) => setInputValue(text.slice(0, MAX_LENGTH))}
        />

        <Text className="text-right text-gray-500 text-sm font-medium leading-6">
          {inputValue.length}/{MAX_LENGTH}
        </Text>
      </View>

      {/* 완료 버튼 */}
      <TouchableOpacity
        disabled={!canSubmit}
        onPress={handleSubmit}
        className="h-[52px] rounded-xl justify-center items-center bg-[#45B310]"
        style={{ opacity: canSubmit ? 1 : 0.5 }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white text-lg font-medium leading-7">완료</Text>
        )}
      </TouchableOpacity>

      {/* Popup */}
      <AlertPopup
        title="변경사항 미저장"
        description="지금 나가면 수정한 내용이 사라집니다"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          router.back();
        }}
        cancelText="취소"
        confirmText="나가기"
      />
    </View>
  );
}
