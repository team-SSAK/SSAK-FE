import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

import ActionPopup from "@/components/actionpopup";

import Avatar from "../../assets/images/avatar.svg";
import Menu from "../../assets/images/Horizontal-Ellipsis-B.svg";
import LineHeart from "../../assets/images/lineheart.svg";
import Message from "../../assets/images/message.svg";

import CommentCard from "../../components/commentcard";
import ReplyCard from "../../components/replaycard";
import ReplyInput from "../../components/replyinput";
import { useDeleteCommunity } from "../../src/hooks/useCommunity";
import { usePost, usePostComment } from "../../src/hooks/usePost";

//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

export default function Post() {
  const { postId, restaurantId } = useLocalSearchParams<{
    postId?: string;
    restaurantId?: string;
  }>();
  const { data: post } = usePost(postId);
  const { mutate: submitComment, isPending } = usePostComment(postId ?? "");
  const { mutate: deleteMutate } = useDeleteCommunity();
  const [commentText, setCommentText] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyTargetAuthor, setReplyTargetAuthor] = useState<string | null>(
    null,
  );
  const [sortLabel, setSortLabel] = useState("최신순");
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [sortPopupPosition, setSortPopupPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showMenuPopup, setShowMenuPopup] = useState(false);
  const [menuPopupPosition, setMenuPopupPosition] = useState({
    top: 0,
    left: 0,
  });

  const onOpenMenuPopup = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const popupWidth = 208;
    const horizontalMargin = 16;
    const rawLeft = pageX - popupWidth + 16;
    const clampedLeft = Math.min(
      screenWidth - popupWidth - horizontalMargin,
      Math.max(horizontalMargin, rawLeft),
    );
    setMenuPopupPosition({ top: pageY + 8, left: clampedLeft });
    setShowMenuPopup(true);
  };

  const onSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || isPending) return;
    submitComment(
      { commentContent: trimmed, parentId: replyTargetId },
      {
        onSuccess: () => {
          setCommentText("");
          setReplyTargetId(null);
          setReplyTargetAuthor(null);
        },
      },
    );
  };

  const onOpenSortPopup = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const popupWidth = 208; // w-52
    const horizontalMargin = 16;

    const rawLeft = pageX - popupWidth + 16;
    const clampedLeft = Math.min(
      screenWidth - popupWidth - horizontalMargin,
      Math.max(horizontalMargin, rawLeft),
    );

    setSortPopupPosition({
      top: pageY + 8,
      left: clampedLeft,
    });
    setShowSortPopup(true);
  };

  const onSelectSort = (label: string) => {
    setSortLabel(label);
    setShowSortPopup(false);
  };

  const formattedDate = post?.postCreateTime
    ? (() => {
        const date = new Date(post.postCreateTime);
        if (Number.isNaN(date.getTime())) {
          return "";
        }
        const yy = String(date.getFullYear()).slice(-2);
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yy}.${mm}.${dd}`;
      })()
    : "25.11.14";

  const firstImage =
    Array.isArray(post?.imageUrls) && post.imageUrls.length > 0
      ? post.imageUrls[0]
      : null;

  const imageUri = firstImage
    ? firstImage.startsWith("http") || firstImage.startsWith("data:image")
      ? firstImage
      : `data:image/jpeg;base64,${firstImage}`
    : "https://placehold.co/361x226";

  return (
    <View key={postId ?? "post-detail"} className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 160,
        }}
      >
        {/* 헤더 */}

        <View className="py-4 flex-row gap-2 items-center flex-1">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <View className="flex flex-1 flex-row justify-between items-center">
            <Text className="text-gray-800 text-xl font-semibold">
              식당 커뮤니티
            </Text>
            <TouchableOpacity onPress={onOpenMenuPopup}>
              <Menu />
            </TouchableOpacity>
          </View>
        </View>

        <View className="py-5 gap-3">
          <View className="flex flex-row justify-between items-start">
            <View className="flex flex-row gap-2">
              <Avatar width="30px" height="30px" />
              <Text className="text-gray-700 font-semibold leading-6">
                {post?.nickname ?? "화여니"}
              </Text>
            </View>
            <Text className="text-gray-400 text-sm font-medium leading-6">
              {formattedDate}
            </Text>
          </View>

          <View className="gap-1.5">
            <Text className="text-gray-900 text-xl font-semibold leading-8">
              {post?.postTitle ?? "오늘의 메뉴!"}
            </Text>
            <Text className="text-gray-700 font-medium leading-6">
              {post?.postContent ??
                "오늘 식당 메뉴 최고네요! 넘 맛있어요! 오늘 식당 메뉴 최고네요! 넘 맛있어요!"}
            </Text>
          </View>

          <Image
            source={{ uri: imageUri }}
            className="self-stretch h-56 rounded-md"
            resizeMode="cover"
          />

          <View className="flex flex-row justify-end gap-3.5">
            <View className="flex flex-row">
              <Message />
              <Text className="text-gray-500 font-medium leading-6">
                {` ${post?.postCommentCnt ?? 0}`}
              </Text>
            </View>
            <View className="flex flex-row">
              <LineHeart />
              <Text className="text-gray-500 font-medium leading-6">
                {` ${post?.postLikeCnt ?? 0}`}
              </Text>
            </View>
          </View>
        </View>

        <View className="h-5 bg-gray-50" style={{ marginHorizontal: -16 }} />

        {post?.comments?.map((comment) => {
          const cd = new Date(comment.commentCreateTime);
          const commentDate = Number.isNaN(cd.getTime())
            ? ""
            : `${String(cd.getFullYear()).slice(-2)}.${String(cd.getMonth() + 1).padStart(2, "0")}.${String(cd.getDate()).padStart(2, "0")}`;
          return (
            <View key={comment.commentId}>
              <CommentCard
                author={comment.nickname}
                content={comment.commentContent}
                date={commentDate}
                onReplyPress={() => {
                  setReplyTargetId(comment.commentId);
                  setReplyTargetAuthor(comment.nickname);
                }}
              />
              {comment.childrenComments?.map((child) => {
                const ccd = new Date(child.commentCreateTime);
                const childDate = Number.isNaN(ccd.getTime())
                  ? ""
                  : `${String(ccd.getFullYear()).slice(-2)}.${String(ccd.getMonth() + 1).padStart(2, "0")}.${String(ccd.getDate()).padStart(2, "0")}`;
                return (
                  <ReplyCard
                    key={child.commentId}
                    author={child.nickname}
                    content={child.commentContent}
                    date={childDate}
                  />
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={showMenuPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenuPopup(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.1)" }}
          onPress={() => setShowMenuPopup(false)}
        >
          <View
            style={{
              position: "absolute",
              top: menuPopupPosition.top,
              left: menuPopupPosition.left,
            }}
          >
            <Pressable
              onPress={(e: GestureResponderEvent) => e.stopPropagation()}
            >
              <ActionPopup
                options={[
                  {
                    label: "수정하기",
                    color: "text-gray-800",
                    onPress: () => setShowMenuPopup(false),
                  },
                  {
                    label: "삭제하기",
                    color: "text-red-700",
                    onPress: () => {
                      setShowMenuPopup(false);
                      if (!post?.postId) return;
                      deleteMutate(
                        {
                          postId: post.postId,
                          restaurantId: restaurantId ?? "",
                        },
                        { onSuccess: () => router.back() },
                      );
                    },
                  },
                ]}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showSortPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortPopup(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.1)" }}
          onPress={() => setShowSortPopup(false)}
        >
          <View
            style={{
              position: "absolute",
              top: sortPopupPosition.top,
              left: sortPopupPosition.left,
            }}
          >
            <Pressable
              onPress={(e: GestureResponderEvent) => e.stopPropagation()}
            >
              <ActionPopup
                options={[
                  {
                    label: "인기순",
                    color: "text-gray-800",
                    onPress: () => onSelectSort("인기순"),
                  },
                  {
                    label: "오래된순",
                    color: "text-gray-800",
                    onPress: () => onSelectSort("오래된순"),
                  },
                  {
                    label: "최신순",
                    color: "text-gray-800",
                    onPress: () => onSelectSort("최신순"),
                  },
                ]}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <View className="absolute bottom-0 left-0 right-0 bg-white pb-[56px]">
        <ReplyInput
          value={commentText}
          onChangeText={setCommentText}
          onSubmit={onSubmitComment}
          placeholder={
            replyTargetAuthor
              ? `${replyTargetAuthor}님께 답글 작성...`
              : "댓글을 작성해주세요."
          }
        />
      </View>

      {/* 하단 그라디언트 */}
      <View
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <View className="flex-1 bg-gradient-to-b from-white/0 to-white/90" />
      </View>
    </View>
  );
}
