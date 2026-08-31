import { useEffect, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import User from "../assets/images/avatar.svg";
import HeartFilled from "../assets/images/heart-filled.svg";
import Heart from "../assets/images/lineheart.svg";
import Message from "../assets/images/message.svg";
import { usePost } from "../src/hooks/usePost";
import { useIsPostLiked, usePostWish } from "../src/hooks/useWish";
import { resolveImageUri } from "../src/utils/image";
import ActionPopup from "./actionpopup";
import OwnerBadge from "./ownerbadge";

interface MockPostProps {
  showBadge?: boolean;
  badge?: string;
  author?: string;
  authorImage?: string;
  isOwner?: boolean;
  title?: string;
  content?: string;
  image?: string;
  images?: string[];
  likedPostId?: number | string;
  likeCount?: number;
  commentCount?: number;
  date?: string;
  isMine?: boolean;
  onMenuPress?: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  onReportPress?: () => void;
  onPress?: () => void;
}

export default function Post({
  showBadge = true,
  badge = "비공개",
  author = "화여니",
  authorImage,
  isOwner = false,
  title = "오늘의 메뉴!",
  content = "오늘 식당 메뉴 최고네요! 넘 맛있어요!",
  image,
  images,
  likedPostId,
  likeCount = 0,
  commentCount = 0,
  date = "25.11.14",
  isMine = true,
  onMenuPress,
  onEditPress,
  onDeletePress,
  onReportPress,
  onPress,
}: MockPostProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [suppressCardPress, setSuppressCardPress] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isImageLoadFailed, setIsImageLoadFailed] = useState(false);
  const isLiked = useIsPostLiked(likedPostId);
  const { mutate: postWish, isPending: isPostWishPending } = usePostWish();

  const hasIncomingImages =
    (Array.isArray(images) && images.length > 0) ||
    (typeof image === "string" && image.trim().length > 0);
  const shouldFetchFallbackImages =
    !hasIncomingImages &&
    likedPostId !== undefined &&
    likedPostId !== null &&
    String(likedPostId).trim().length > 0;
  const { data: fallbackPost } = usePost(
    shouldFetchFallbackImages ? likedPostId : undefined,
  );

  const fallbackImages =
    Array.isArray(fallbackPost?.imageUrls) && fallbackPost.imageUrls.length > 0
      ? fallbackPost.imageUrls
      : [];

  const candidateImageUris = [
    ...(Array.isArray(images)
      ? images.filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        )
      : []),
    ...fallbackImages,
    ...(typeof image === "string" && image.trim().length > 0 ? [image] : []),
  ].map((value) => value.trim());
  const candidateImageKey = candidateImageUris.join("|");

  const currentImage = candidateImageUris[imageIndex];
  const trimmedImage = currentImage?.trim();
  const trimmedAuthorImage = authorImage?.trim();
  const normalizedImageUri = trimmedImage
    ? resolveImageUri(trimmedImage)
    : null;
  const normalizedAuthorImageUri = trimmedAuthorImage
    ? resolveImageUri(trimmedAuthorImage)
    : null;
  const hasImage = Boolean(normalizedImageUri);
  const hasAuthorImage = Boolean(normalizedAuthorImageUri);

  useEffect(() => {
    setImageIndex(0);
    setIsImageLoadFailed(false);
  }, [candidateImageKey]);

  const handleMenuPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const popupWidth = 208; // w-52
    const horizontalMargin = 16;

    const rawLeft = pageX - popupWidth + 16;
    const clampedLeft = Math.min(
      screenWidth - popupWidth - horizontalMargin,
      Math.max(horizontalMargin, rawLeft),
    );

    setMenuPosition({
      top: pageY + 8,
      left: clampedLeft,
    });
    setSuppressCardPress(true);
    setShowMenu(true);
    onMenuPress?.();
  };

  const handleCardPress = () => {
    if (!onPress) {
      return;
    }

    if (showMenu || suppressCardPress) {
      return;
    }

    onPress();
  };

  const runMenuAction = (action?: () => void) => {
    setSuppressCardPress(true);
    action?.();
    setShowMenu(false);
    setTimeout(() => {
      setSuppressCardPress(false);
    }, 250);
  };

  const handleLikePress = () => {
    if (!likedPostId || isPostWishPending) {
      return;
    }

    postWish({ likedPostId });
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress && !showMenu ? 0.7 : 1}
      onPress={handleCardPress}
      className="self-stretch py-4 bg-white border-b border-gray-100 flex flex-col justify-start items-start"
    >
      <View className="self-stretch flex flex-col justify-start items-start gap-2">
        {/* 배지 */}
        {showBadge && (
          <View className="px-2.5 py-0.5 bg-gray-200 rounded-[7px] justify-center items-center">
            <Text className="text-gray-500 text-xs font-semibold leading-5">
              {badge}
            </Text>
          </View>
        )}

        {/* 작성자 */}
        <View className="self-stretch flex-row justify-start items-start gap-2">
          <View className="flex-1 flex-row items-center gap-2">
            {hasAuthorImage ? (
              <Image
                source={{ uri: normalizedAuthorImageUri }}
                className="w-[30px] h-[30px] rounded-full bg-slate-100"
              />
            ) : (
              <User width="30px" height="30px" />
            )}
            <Text className="text-gray-700 text-base font-semibold leading-6">
              {author}
            </Text>
            {isOwner && <OwnerBadge />}
          </View>

          {/* 더보기 버튼 */}
          <TouchableOpacity
            onPress={handleMenuPress}
            className="w-4 h-4 justify-center items-center"
          >
            <Text className="text-gray-500 text-lg leading-none tracking-widest">
              ...
            </Text>
          </TouchableOpacity>
        </View>

        {/* 제목 + 내용 + 썸네일 */}
        <View className="self-stretch flex-row justify-start items-center gap-4">
          <View className="flex-1 flex-col gap-0.5">
            <Text
              className="text-gray-700 text-base font-semibold leading-6"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-gray-500 text-base font-medium leading-6"
              numberOfLines={1}
            >
              {content}
            </Text>
          </View>
          {hasImage ? (
            isImageLoadFailed ? (
              <View className="w-[68px] h-[68px] rounded-md bg-slate-200" />
            ) : (
              <Image
                source={{ uri: normalizedImageUri }}
                className="w-[68px] h-[68px] rounded-md bg-slate-100"
                onError={() => {
                  if (imageIndex < candidateImageUris.length - 1) {
                    setImageIndex((prev) => prev + 1);
                    return;
                  }

                  setIsImageLoadFailed(true);
                }}
              />
            )
          ) : null}
        </View>

        {/* 좋아요 / 댓글 / 날짜 */}
        <View className="self-stretch flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-0.5">
              <Message width="20px" height="20px" />
              <Text className="text-gray-500 text-sm font-medium leading-6">
                {commentCount}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLikePress}
              className="flex-row items-center gap-0.5"
              activeOpacity={0.8}
            >
              {isLiked ? (
                <HeartFilled width="20px" height="20px" />
              ) : (
                <Heart width="20px" height="20px" />
              )}
              <Text className="text-gray-500 text-sm font-medium leading-6">
                {likeCount}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-px h-3 bg-gray-500" />
          <Text className="text-gray-500 text-sm font-medium leading-6">
            {date}
          </Text>
        </View>
      </View>

      {/* 팝업 Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          onPress={() => setShowMenu(false)}
        >
          <View
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            <Pressable
              onPress={(e: GestureResponderEvent) => e.stopPropagation()}
            >
              <ActionPopup
                options={
                  isMine
                    ? [
                        {
                          label: "수정하기",
                          color: "text-gray-800",
                          onPress: () => {
                            runMenuAction(onEditPress);
                          },
                        },
                        {
                          label: "삭제하기",
                          color: "text-red-700",
                          onPress: () => {
                            runMenuAction(onDeletePress);
                          },
                        },
                      ]
                    : [
                        {
                          label: "신고하기",
                          color: "text-gray-800",
                          onPress: () => {
                            runMenuAction(onReportPress);
                          },
                        },
                      ]
                }
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
}
