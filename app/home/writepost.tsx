import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import { usePatchPost, usePost } from "../../src/hooks/usePost";

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
  const {
    restaurantId,
    postId,
    postTitle,
    postContent,
    postVisibility,
    postImages,
  } = useLocalSearchParams<{
    restaurantId?: string;
    postId?: string;
    postTitle?: string;
    postContent?: string;
    postVisibility?: string;
    postImages?: string;
  }>();
  const { mutate: postCommunityMutation, isPending } = usePostCommunity();
  const { mutate: patchPostMutation, isPending: isPatchPending } =
    usePatchPost();
  const { data: editPostDetail } = usePost(postId);

  const isEditMode = typeof postId === "string" && postId.trim().length > 0;
  const initialVisibility =
    postVisibility === "false"
      ? false
      : postVisibility === "true"
        ? true
        : true;
  const existingImagesFromParams = useMemo(() => {
    if (!postImages) {
      return [];
    }

    try {
      const parsed = JSON.parse(postImages);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (value): value is string => typeof value === "string",
      );
    } catch {
      const singleImage = postImages.trim();
      return singleImage.length > 0 ? [singleImage] : [];
    }
  }, [postImages]);

  const existingImages = useMemo(() => {
    const hasDetailImages = Array.isArray(editPostDetail?.imageUrls);
    const base = hasDetailImages
      ? (editPostDetail?.imageUrls ?? [])
      : existingImagesFromParams;

    return base
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .map((value) =>
        value.startsWith("http") || value.startsWith("data:image")
          ? value
          : `data:image/jpeg;base64,${value}`,
      );
  }, [editPostDetail?.imageUrls, existingImagesFromParams]);

  const [postVisibilityState, setPostVisibilityState] =
    useState(initialVisibility);
  const [title, setTitle] = useState(postTitle ?? "");
  const [content, setContent] = useState(postContent ?? "");
  const [newImages, setNewImages] = useState<string[]>([]);
  const LINE_HEIGHT = 24; // leading-6 = 24px
  const [contentHeight, setContentHeight] = useState(LINE_HEIGHT * 2);
  const [imageSizes, setImageSizes] = useState<
    { width: number; height: number }[]
  >([]);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const isSubmitting = isPending || isPatchPending;
  const canSubmit = title.trim().length > 0 && content.trim().length > 0;
  const hasDraft =
    title.trim().length > 0 ||
    content.trim().length > 0 ||
    newImages.length > 0 ||
    existingImages.length > 0;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setNewImages((prev) => [...prev, ...uris]);
      const sizes = result.assets.map((asset) => ({
        width: asset.width,
        height: asset.height,
      }));
      setImageSizes((prev) => [...prev, ...sizes]);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    if (isEditMode) {
      patchPostMutation(
        {
          postId: postId as string,
          payload: {
            postVisibility: postVisibilityState,
            postTitle: title.trim(),
            postContent: content.trim(),
            newImages,
          },
        },
        {
          onSuccess: () => {
            router.back();
          },
        },
      );
      return;
    }

    if (!restaurantId) {
      return;
    }

    postCommunityMutation(
      {
        restaurantId,
        payload: {
          postVisibility: postVisibilityState,
          postTitle: title.trim(),
          postContent: content.trim(),
          images: newImages,
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
              <Text className="text-gray-700 text-base font-medium leading-6">
                취소
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-900 text-xl font-semibold leading-8">
              {isEditMode ? "글수정" : "글쓰기"}
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`px-1 py-1.5 flex flex-row items-center justify-center ${
                canSubmit && !isSubmitting ? "opacity-100" : "opacity-30"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#16A34A" />
              ) : (
                <Text className="text-green-600 text-base font-medium leading-6">
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
            {(existingImages.length > 0 || newImages.length > 0) && (
              <View className="mt-4 flex flex-col gap-4">
                {existingImages.map((uri, idx) => (
                  <RNImage
                    key={`existing-${idx}`}
                    source={{ uri }}
                    className="w-full rounded-md"
                    style={{ width: "100%", aspectRatio: 1 }}
                    resizeMode="cover"
                  />
                ))}
                {newImages.map((uri, idx) => (
                  <RNImage
                    key={`new-${idx}`}
                    source={{ uri }}
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
                selected={postVisibilityState}
                onPress={() => setPostVisibilityState(true)}
              />
              <PublicToggle
                label="비공개"
                selected={!postVisibilityState}
                onPress={() => setPostVisibilityState(false)}
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
