import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Avatar from "../../assets/images/avatar.svg";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import EditBtn from "../../assets/images/editbtn.svg";
import AlertPopup from "../../components/alertpopup";
import TextInput from "../../components/input/textinput";

import { useMe } from "@/src/hooks/useMe";

const MAX_LENGTH = 8;

export default function EditProfile() {
  const { me, isLoading, updateMe } = useMe();

  const [inputValue, setInputValue] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [initialProfileImage, setInitialProfileImage] = useState<string | null>(
    null,
  );
  const [pickedWebFile, setPickedWebFile] = useState<File | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (hasInitialized || !me) {
      return;
    }

    const nickname = me.userNm ?? "";
    const image = me.userProfileImg ?? null;
    setInputValue(nickname);
    setInitialValue(nickname);
    setProfileImage(image);
    setInitialProfileImage(image);
    setHasInitialized(true);
  }, [hasInitialized, me]);

  const hasChanges =
    inputValue !== initialValue || profileImage !== initialProfileImage;

  const isButtonEnabled =
    inputValue.length >= 1 &&
    inputValue.length <= MAX_LENGTH &&
    hasChanges &&
    !isLoading &&
    !isSubmitting;

  const handleChangeText = (text: string) => {
    setInputValue(text);
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("권한 필요", "갤러리 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0] as ImagePicker.ImagePickerAsset & {
          file?: File;
        };
        setProfileImage(asset.uri);
        setPickedWebFile(asset.file ?? null);
      }
    } catch (error) {
      console.error("이미지 선택 실패:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      let imageFile: any = undefined;

      if (profileImage && profileImage !== initialProfileImage) {
        const filename = profileImage.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        if (Platform.OS === "web" && pickedWebFile) {
          imageFile = pickedWebFile;
        } else {
          imageFile = {
            uri: profileImage,
            type,
            name: filename,
          } as any;
        }
      }

      const ok = await updateMe(
        inputValue !== initialValue ? inputValue : undefined,
        imageFile,
      );

      if (!ok) {
        console.error("프로필 수정 실패");
        return;
      }

      setInitialValue(inputValue);
      setInitialProfileImage(profileImage);
      router.replace("/mypage/main");
    } catch (error) {
      console.error("프로필 수정 실패", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackPress = () => {
    if (hasChanges) {
      setIsModalVisible(true);
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white justify-between px-4 py-[56px]">
      <View>
        {/* 헤더 */}
        <View className="py-4 flex-row gap-2 items-center mb-10">
          <TouchableOpacity onPress={handleBackPress}>
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
            <TouchableOpacity
              className="absolute bottom-0 right-0"
              onPress={pickImage}
            >
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
          onChangeText={handleChangeText}
        />

        <Text className="text-right text-gray-500 text-sm font-medium leading-6">
          {inputValue.length}/{MAX_LENGTH}
        </Text>
      </View>

      {/* 완료 버튼 */}
      <TouchableOpacity
        disabled={!isButtonEnabled}
        onPress={handleSubmit}
        className={`h-[52px] rounded-xl justify-center items-center ${
          isButtonEnabled ? "bg-[#45B310]" : "bg-slate-300"
        }`}
      >
        <Text className="text-white text-lg font-medium leading-7">
          {isSubmitting ? "저장 중..." : "완료"}
        </Text>
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
