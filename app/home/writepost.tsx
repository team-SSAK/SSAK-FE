import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Image as RNImage,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Image from "../../assets/images/image.svg";
import { usePostCommunity } from "../../src/hooks/useCommunity";

function PublicToggle({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-1 py-1.5 flex flex-row items-center gap-3"
    >
      <View
        className={`w-5 h-5 bg-white rounded-full ${
          selected ? "border-[6px] border-lime-600" : "border border-slate-300"
        }`}
      />
      <Text className="text-black text-base font-medium leading-6">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Popup({
  title = "게시글 작성을 취소하시겠어요?",
  description = "지금 나가면 작성 중인 게시글이 삭제됩니다.",
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
        <View className="w-72 p-5 bg-white rounded-[20px] gap-[18px]">
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
                계속 작성
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

export default function WritePost() {
  const router = useRouter();
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const { mutate: postCommunityMutation, isPending } = usePostCommunity();

  const [postVisibility, setPostVisibility] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const LINE_HEIGHT = 24; // leading-6 = 24px
  const [contentHeight, setContentHeight] = useState(LINE_HEIGHT * 2);
  const [imageSizes, setImageSizes] = useState<
    { width: number; height: number }[]
  >([]);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const canSubmit = title.trim().length > 0 && content.trim().length > 0;
  const hasDraft =
    title.trim().length > 0 || content.trim().length > 0 || images.length > 0;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const base64Images = result.assets
        .filter((asset) => asset.base64)
        .map((asset) => asset.base64 as string);
      setImages((prev) => [...prev, ...base64Images]);
      const sizes = result.assets
        .filter((asset) => asset.base64)
        .map((asset) => ({ width: asset.width, height: asset.height }));
      setImageSizes((prev) => [...prev, ...sizes]);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit || !restaurantId) {
      return;
    }

    postCommunityMutation(
      {
        restaurantId,
        payload: {
          postVisibility,
          postTitle: title.trim(),
          postContent: content.trim(),
          images,
        },
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  const handleCancelPress = () => {
    if (hasDraft) {
      setShowExitPopup(true);
      return;
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View className="flex-1 pt-[72px] px-4">
        <View className="flex flex-col flex-1">
          <View className="py-3 flex flex-row justify-between">
            <TouchableOpacity
              onPress={handleCancelPress}
              className="px-1 py-1.5"
            >
              <Text className="text-gray-700 text-sm font-medium leading-6">
                취소
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-900 text-xl font-semibold leading-8">
              글쓰기
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit || isPending}
              className={`px-1 py-1.5 flex flex-row items-center justify-center ${
                canSubmit && !isPending ? "opacity-100" : "opacity-30"
              }`}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#16A34A" />
              ) : (
                <Text className="text-green-600 text-sm font-medium leading-6">
                  완료
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력해주세요."
              placeholderTextColor="#94A3B8"
              className="text-gray-900 text-xl font-semibold leading-8"
            />
            <View className="my-3 self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-100" />
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="구내식당 리뷰와 무관한 비난, 부적절한 글 또는 욕설 사용시 별도의 안내 없이 글이 삭제될 수 있습니다."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              onContentSizeChange={(e: {
                nativeEvent: { contentSize: { height: number } };
              }) => {
                const h = e.nativeEvent.contentSize.height;
                setContentHeight(Math.max(LINE_HEIGHT, h));
              }}
              style={{
                height: content.length === 0 ? LINE_HEIGHT * 2 : contentHeight,
              }}
              className="text-gray-900 font-medium leading-6"
            />
            {images.length > 0 && (
              <View className="mt-4 flex flex-col gap-4">
                {images.map((b64, idx) => (
                  <RNImage
                    key={idx}
                    source={{ uri: `data:image/jpeg;base64,${b64}` }}
                    className="w-full rounded-md"
                    style={{
                      width: "100%",
                      aspectRatio: imageSizes[idx]
                        ? imageSizes[idx].width / imageSizes[idx].height
                        : 1,
                    }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* 하단 바 */}
          <View className="border-t border-slate-100 flex flex-row justify-between items-center py-2 mb-14">
            {/* 이미지 버튼 */}
            <TouchableOpacity
              onPress={pickImage}
              className="flex flex-row items-center gap-1"
            >
              <Image />
              <Text className="text-black text-base font-medium leading-6">
                이미지
              </Text>
            </TouchableOpacity>

            {/* 공개/비공개 라디오 */}
            <View className="flex flex-row items-center gap-2.5">
              <PublicToggle
                label="공개"
                selected={postVisibility}
                onPress={() => setPostVisibility(true)}
              />
              <PublicToggle
                label="비공개"
                selected={!postVisibility}
                onPress={() => setPostVisibility(false)}
              />
            </View>
          </View>
        </View>
      </View>

      <Popup
        visible={showExitPopup}
        onCancel={() => setShowExitPopup(false)}
        onConfirm={() => {
          setShowExitPopup(false);
          router.back();
        }}
      />
    </KeyboardAvoidingView>
  );
}
