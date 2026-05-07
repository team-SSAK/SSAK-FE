import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Image from "../../assets/images/image.svg";
import PostGradient from "../../assets/images/PostGradient.svg";
import X from "../../assets/images/x.svg";
import AlertPopup from "../../components/alertpopup";
import { usePostCommunity } from "../../src/hooks/useCommunity";
import { usePatchPost, usePost } from "../../src/hooks/usePost";
import { normalizeImageList } from "../../src/utils/image";

// Alert popup text for image delete
const DELETE_IMAGE_POPUP = {
  title: "사진을 삭제하시겠습니까?",
  description: "삭제된 사진은 다시 되돌릴 수 없습니다",
  cancelText: "취소",
  confirmText: "삭제하기",
};

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

export default function WritePost() {
  // ...existing code...
  // State for removed existing images (indices)
  const [removedExistingImageIdxs, setRemovedExistingImageIdxs] = useState<
    number[]
  >([]);
  // State for image delete popup
  const [showDeleteImagePopup, setShowDeleteImagePopup] = useState(false);
  const [deleteImageInfo, setDeleteImageInfo] = useState<{
    type: "existing" | "new";
    idx: number;
  } | null>(null);
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

    return normalizeImageList(base);
  }, [editPostDetail?.imageUrls, existingImagesFromParams]);

  const remainingExistingImages = useMemo(
    () =>
      existingImages.filter(
        (_, idx) => !removedExistingImageIdxs.includes(idx),
      ),
    [existingImages, removedExistingImageIdxs],
  );

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
            // Keep remaining existing images by re-sending them with new ones.
            newImages: [...remainingExistingImages, ...newImages],
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
            {(remainingExistingImages.length > 0 || newImages.length > 0) && (
              <View className="mt-4 flex flex-col gap-4">
                {existingImages.map((uri, idx) =>
                  removedExistingImageIdxs.includes(idx) ? null : (
                    <View
                      key={`existing-${idx}`}
                      style={{ position: "relative", width: "100%" }}
                    >
                      <RNImage
                        source={{ uri }}
                        className="w-full rounded-md"
                        style={{ width: "100%", aspectRatio: 1 }}
                        resizeMode="cover"
                      />
                      {/* PostGradient overlay */}
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                        }}
                      >
                        <PostGradient
                          width="100%"
                          height={39}
                          style={{
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                          }}
                        />
                      </View>
                      {/* X icon overlay */}
                      <View
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setDeleteImageInfo({ type: "existing", idx });
                            setShowDeleteImagePopup(true);
                          }}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <X width={20} height={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ),
                )}
                {newImages.map((uri, idx) => (
                  <View
                    key={`new-${idx}`}
                    style={{ position: "relative", width: "100%" }}
                  >
                    <RNImage
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
                    {/* PostGradient overlay */}
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                      }}
                    >
                      <PostGradient
                        width="100%"
                        height={39}
                        style={{
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      />
                    </View>
                    {/* X icon overlay */}
                    <View
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setDeleteImageInfo({ type: "new", idx });
                          setShowDeleteImagePopup(true);
                        }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <X width={20} height={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
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

      <AlertPopup
        title="게시글 작성을 취소하시겠어요?"
        description="지금 나가면 작성 중인 게시글이 삭제됩니다."
        visible={showExitPopup}
        onCancel={() => setShowExitPopup(false)}
        onConfirm={() => {
          setShowExitPopup(false);
          router.back();
        }}
        cancelText="계속 작성"
        confirmText="나가기"
      />

      {/* 이미지 삭제 AlertPopup */}
      <AlertPopup
        title={DELETE_IMAGE_POPUP.title}
        description={DELETE_IMAGE_POPUP.description}
        visible={showDeleteImagePopup}
        onCancel={() => {
          setShowDeleteImagePopup(false);
          setDeleteImageInfo(null);
        }}
        onConfirm={() => {
          if (deleteImageInfo) {
            if (deleteImageInfo.type === "existing") {
              setRemovedExistingImageIdxs((prev) => [
                ...prev,
                deleteImageInfo.idx,
              ]);
            } else if (deleteImageInfo.type === "new") {
              setNewImages((prev) =>
                prev.filter((_, i) => i !== deleteImageInfo.idx),
              );
              setImageSizes((prev) =>
                prev.filter((_, i) => i !== deleteImageInfo.idx),
              );
            }
          }
          setShowDeleteImagePopup(false);
          setDeleteImageInfo(null);
        }}
        cancelText={DELETE_IMAGE_POPUP.cancelText}
        confirmText={DELETE_IMAGE_POPUP.confirmText}
        // confirmColor intentionally omitted to use default
      />
    </KeyboardAvoidingView>
  );
}
