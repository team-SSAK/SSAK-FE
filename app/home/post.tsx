import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

import AlertPopup from "../../components/alertpopup";
import AlertPopupRadio from "../../components/alertpopupradio";

import ActionPopup from "@/components/actionpopup";

import Avatar from "../../assets/images/avatar.svg";
import HeartFilled from "../../assets/images/heart-filled.svg";
import Menu from "../../assets/images/Horizontal-Ellipsis-B.svg";
import LineHeart from "../../assets/images/lineheart.svg";
import Message from "../../assets/images/message.svg";

import CommentCard from "../../components/commentcard";
import ReplyCard from "../../components/replaycard";
import ReplyInput from "../../components/replyinput";
import { useDeleteComment, usePatchComment } from "../../src/hooks/useComment";
import { useDeleteCommunity } from "../../src/hooks/useCommunity";
import { useMe } from "../../src/hooks/useMe";
import { usePost, usePostComment } from "../../src/hooks/usePost";
import { useReport, useReportComment } from "../../src/hooks/useReport";
import {
  useCommentWish,
  useIsPostLiked,
  useLikedCommentIds,
  usePostWish,
} from "../../src/hooks/useWish";
import { normalizeImageList, resolveImageUri } from "../../src/utils/image";

//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

function Popup({
  title = "이미 신고된 글입니다",
  description = "현재 검토가 진행중입니다",
  onConfirm,
  visible = false,
}: {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  visible?: boolean;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
      >
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
              onPress={onConfirm}
              className="flex-1 h-10 px-2 py-2 bg-green-400 rounded-[10px] justify-center items-center"
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

export default function Post() {
  type CommentMenuTarget = {
    commentId: number;
    commentContent: string;
    isMine: boolean;
  };

  const {
    postId,
    restaurantId,
    postTitle,
    postContent,
    nickname,
    authorProfileImg,
    postCreateTime,
    postCommentCnt,
    postImage,
    postImages,
  } = useLocalSearchParams<{
    postId?: string;
    restaurantId?: string;
    postTitle?: string;
    postContent?: string;
    nickname?: string;
    authorProfileImg?: string;
    postCreateTime?: string;
    postCommentCnt?: string;
    postImage?: string;
    postImages?: string;
  }>();
  const { data: post } = usePost(postId);
  const { mutate: submitComment, isPending } = usePostComment(postId ?? "");
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: patchComment, isPending: isPatchCommentPending } =
    usePatchComment();
  const { mutate: deleteMutate } = useDeleteCommunity();
  const { mutate: reportPost } = useReport();
  const { mutate: reportComment } = useReportComment();
  const { mutate: postWish, isPending: isPostWishPending } = usePostWish();
  const { mutate: commentWish } = useCommentWish();
  const { data: likedCommentIds = [] } = useLikedCommentIds();
  const isLiked = useIsPostLiked(post?.postId ?? postId);
  const { me } = useMe();
  const [imageSizes, setImageSizes] = useState<
    Record<string, { width: number; height: number }>
  >({});
  const [commentText, setCommentText] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyTargetAuthor, setReplyTargetAuthor] = useState<string | null>(
    null,
  );
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [showSortPopup, setShowSortPopup] = useState(false);
  const sortPopupPosition = {
    top: 0,
    left: 0,
  };
  const [showMenuPopup, setShowMenuPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [menuPopupPosition, setMenuPopupPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showCommentMenuPopup, setShowCommentMenuPopup] = useState(false);
  const [commentMenuPopupPosition, setCommentMenuPopupPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [commentMenuTarget, setCommentMenuTarget] =
    useState<CommentMenuTarget | null>(null);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isDuplicateReportError = (error: unknown) => {
    const err = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };

    const responseMessage = err.response?.data?.message ?? "";
    const fallbackMessage = err.message ?? "";

    return (
      err.response?.status === 409 ||
      responseMessage.includes("이미 신고") ||
      fallbackMessage.includes("이미 신고")
    );
  };

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

  const onOpenCommentMenuPopup = (
    event: GestureResponderEvent,
    target: CommentMenuTarget,
  ) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const popupWidth = 208;
    const horizontalMargin = 16;
    const rawLeft = pageX - popupWidth + 16;
    const clampedLeft = Math.min(
      screenWidth - popupWidth - horizontalMargin,
      Math.max(horizontalMargin, rawLeft),
    );

    setCommentMenuTarget(target);
    setCommentMenuPopupPosition({ top: pageY + 8, left: clampedLeft });
    setShowCommentMenuPopup(true);
  };

  const onSubmitComment = () => {
    const trimmed = commentText.trim();

    if (!trimmed) {
      return;
    }

    if (editingCommentId !== null) {
      if (isPatchCommentPending) {
        return;
      }

      patchComment(
        {
          commentId: editingCommentId,
          postId: post?.postId ?? postId,
          commentContent: trimmed,
        },
        {
          onSuccess: () => {
            setCommentText("");
            setEditingCommentId(null);
            setReplyTargetId(null);
            setReplyTargetAuthor(null);
          },
        },
      );
      return;
    }

    if (isPending) return;

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

  const onSelectSort = (_label: string) => {
    setShowSortPopup(false);
  };

  const fallbackDate = postCreateTime ? new Date(postCreateTime) : null;
  const fallbackFormattedDate =
    fallbackDate && !Number.isNaN(fallbackDate.getTime())
      ? `${String(fallbackDate.getFullYear()).slice(-2)}.${String(fallbackDate.getMonth() + 1).padStart(2, "0")}.${String(fallbackDate.getDate()).padStart(2, "0")}`
      : "25.11.14";

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
    : fallbackFormattedDate;

  let parsedParamImages: string[] = [];

  if (postImages) {
    try {
      const parsed = JSON.parse(postImages);
      if (Array.isArray(parsed)) {
        parsedParamImages = parsed.filter(
          (value): value is string => typeof value === "string",
        );
      }
    } catch {
      parsedParamImages = [];
    }
  }

  const rawImages =
    Array.isArray(post?.imageUrls) && post.imageUrls.length > 0
      ? post.imageUrls
      : parsedParamImages.length > 0
        ? parsedParamImages
        : postImage?.trim()
          ? [postImage.trim()]
          : [];

  const imageUris = normalizeImageList(rawImages);
  const resolvedAuthorProfileImage =
    typeof post?.authorProfileImg === "string" &&
    post.authorProfileImg.trim().length > 0
      ? resolveImageUri(post.authorProfileImg)
      : typeof authorProfileImg === "string" &&
          authorProfileImg.trim().length > 0
        ? resolveImageUri(authorProfileImg)
        : null;

  const currentAuthor = (post?.nickname ?? nickname ?? "").trim();
  const myNickname = (me?.userNm ?? "").trim();
  const isMine = myNickname.length > 0 && currentAuthor === myNickname;
  const displayedLikeCount = post?.postLikeCnt ?? 0;

  useEffect(() => {
    let isCancelled = false;

    imageUris.forEach((uri) => {
      if (imageSizes[uri]) {
        return;
      }

      Image.getSize(
        uri,
        (width: number, height: number) => {
          if (isCancelled) {
            return;
          }

          setImageSizes((prev) => ({
            ...prev,
            [uri]: { width, height },
          }));
        },
        () => {
          if (isCancelled) {
            return;
          }

          setImageSizes((prev) => ({
            ...prev,
            [uri]: { width: 1, height: 1 },
          }));
        },
      );
    });

    return () => {
      isCancelled = true;
    };
  }, [imageSizes, imageUris]);

  const handlePostLikePress = () => {
    const resolvedPostId = post?.postId ?? postId;

    if (!resolvedPostId || isPostWishPending) {
      return;
    }

    postWish({ likedPostId: resolvedPostId });
  };

  const handleCommentLikePress = (likedCommentId: number) => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[POST] comment like press", {
        likedCommentId,
        postId: post?.postId ?? postId,
      });
    }

    commentWish({
      likedCommentId,
      postId: post?.postId ?? postId,
    });
  };

  const handleCommentReportPress = () => {
    const target = commentMenuTarget;

    if (!target || !target.commentContent.trim()) {
      setShowCommentMenuPopup(false);
      return;
    }

    setShowCommentMenuPopup(false);
    setCommentMenuTarget(null);

    setTimeout(() => {
      reportComment(
        {
          commentId: target.commentId,
          postId: post?.postId ?? postId,
          reportContent: target.commentContent,
        },
        {
          onError: (error) => {
            if (isDuplicateReportError(error)) {
              setShowReportPopup(true);
            }
          },
        },
      );
    }, 0);
  };

  const handleCommentEditPress = () => {
    const target = commentMenuTarget;

    if (!target) {
      setShowCommentMenuPopup(false);
      return;
    }

    setShowCommentMenuPopup(false);
    setEditingCommentId(target.commentId);
    setCommentText(target.commentContent);
    setReplyTargetId(null);
    setReplyTargetAuthor(null);
    setCommentMenuTarget(null);
  };

  const handleCommentDeletePress = () => {
    const target = commentMenuTarget;

    if (!target) {
      setShowCommentMenuPopup(false);
      return;
    }

    setShowCommentMenuPopup(false);

    deleteComment(
      {
        commentId: target.commentId,
        postId: post?.postId ?? postId,
      },
      {
        onSuccess: () => {
          if (editingCommentId === target.commentId) {
            setEditingCommentId(null);
            setCommentText("");
          }

          setCommentMenuTarget(null);
        },
      },
    );
  };

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
              {resolvedAuthorProfileImage ? (
                <Image
                  source={{ uri: resolvedAuthorProfileImage }}
                  className="w-[30px] h-[30px] rounded-full bg-slate-100"
                />
              ) : (
                <Avatar width="30px" height="30px" />
              )}
              <Text className="text-gray-700 font-semibold leading-6">
                {post?.nickname ?? nickname ?? "화여니"}
              </Text>
            </View>
            <Text className="text-gray-400 text-sm font-medium leading-6">
              {formattedDate}
            </Text>
          </View>

          <View className="gap-1.5">
            <Text className="text-gray-900 text-xl font-semibold leading-8">
              {post?.postTitle ?? postTitle ?? "오늘의 메뉴!"}
            </Text>
            <Text className="text-gray-700 font-medium leading-6">
              {post?.postContent ??
                postContent ??
                "오늘 식당 메뉴 최고네요! 넘 맛있어요! 오늘 식당 메뉴 최고네요! 넘 맛있어요!"}
            </Text>
          </View>

          {imageUris.length > 0 ? (
            <View className="gap-2">
              {imageUris.map((uri, index) => {
                const imageSize = imageSizes[uri];

                return (
                  <Image
                    key={`${uri}-${index}`}
                    source={{ uri }}
                    className="w-full rounded-md"
                    style={{
                      width: "100%",
                      aspectRatio: imageSize
                        ? imageSize.width / imageSize.height
                        : 1,
                    }}
                    resizeMode="cover"
                  />
                );
              })}
            </View>
          ) : null}

          <View className="flex flex-row justify-end items-center gap-3.5">
            <View className="flex flex-row">
              <Message width={24} height={24} />
              <Text className="text-gray-500 font-medium leading-6">
                {` ${post?.postCommentCnt ?? Number(postCommentCnt ?? 0)}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handlePostLikePress}
              className="flex flex-row"
              activeOpacity={0.8}
            >
              {isLiked ? (
                <HeartFilled width={24} height={24} />
              ) : (
                <LineHeart width={24} height={24} />
              )}
              <Text className="text-gray-500 font-medium leading-6">
                {` ${displayedLikeCount}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-5 bg-gray-50" style={{ marginHorizontal: -16 }} />

        {post?.comments?.map((comment) => {
          const cd = new Date(comment.commentCreateTime);
          const commentDate = Number.isNaN(cd.getTime())
            ? ""
            : `${String(cd.getFullYear()).slice(-2)}.${String(cd.getMonth() + 1).padStart(2, "0")}.${String(cd.getDate()).padStart(2, "0")}`;
          const isMyComment =
            myNickname.length > 0 && comment.nickname.trim() === myNickname;
          return (
            <View key={comment.commentId}>
              <CommentCard
                author={comment.nickname}
                content={comment.commentContent}
                likeCount={comment.commentLikeCnt ?? 0}
                date={commentDate}
                isLiked={likedCommentIds.includes(String(comment.commentId))}
                isMine={isMyComment}
                onLikePress={() => handleCommentLikePress(comment.commentId)}
                onMenuPress={(event) =>
                  onOpenCommentMenuPopup(event, {
                    commentId: comment.commentId,
                    commentContent: comment.commentContent,
                    isMine: isMyComment,
                  })
                }
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
                const isMyReply =
                  myNickname.length > 0 && child.nickname.trim() === myNickname;
                return (
                  <ReplyCard
                    key={child.commentId}
                    author={child.nickname}
                    content={child.commentContent}
                    likeCount={child.commentLikeCnt ?? 0}
                    date={childDate}
                    isLiked={likedCommentIds.includes(String(child.commentId))}
                    isMine={isMyReply}
                    onLikePress={() => handleCommentLikePress(child.commentId)}
                    onMenuPress={(event) =>
                      onOpenCommentMenuPopup(event, {
                        commentId: child.commentId,
                        commentContent: child.commentContent,
                        isMine: isMyReply,
                      })
                    }
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
                options={
                  isMine
                    ? [
                        {
                          label: "수정하기",
                          color: "text-gray-800",
                          onPress: () => {
                            setShowMenuPopup(false);
                            if (!post?.postId && !postId) return;

                            const resolvedPostId = String(
                              post?.postId ?? postId ?? "",
                            );
                            const resolvedPostTitle =
                              post?.postTitle ?? postTitle ?? "";
                            const resolvedPostContent =
                              post?.postContent ?? postContent ?? "";
                            const resolvedPostVisibility =
                              post?.postVisibility ?? true;
                            const resolvedPostImages =
                              post?.imageUrls ??
                              (postImage?.trim() ? [postImage.trim()] : []);

                            router.push({
                              pathname: "/home/writepost",
                              params: {
                                restaurantId: String(restaurantId ?? ""),
                                postId: resolvedPostId,
                                postTitle: resolvedPostTitle,
                                postContent: resolvedPostContent,
                                postVisibility: String(resolvedPostVisibility),
                                postImages: JSON.stringify(resolvedPostImages),
                              },
                            });
                          },
                        },
                        {
                          label: "삭제하기",
                          color: "text-red-700",
                          onPress: () => {
                            setShowMenuPopup(false);
                            setShowDeletePopup(true);
                          },
                        },
                      ]
                    : [
                        {
                          label: "신고하기",
                          color: "text-gray-800",
                          onPress: () => {
                            setShowMenuPopup(false);
                            setTimeout(() => setShowReportPopup(true), 200);
                          },
                        },
                      ]
                }
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <AlertPopupRadio
        visible={showReportPopup}
        title="신고 사유를 선택해주세요"
        onCancel={() => setShowReportPopup(false)}
        onConfirm={() => {
          const resolvedPostId = post?.postId ?? postId;
          if (!resolvedPostId) {
            setShowReportPopup(false);
            return;
          }

          setShowReportPopup(false);
          reportPost(
            {
              postId: resolvedPostId,
              reportContent: "string",
            },
            {
              onSuccess: () => {
                setShowReportConfirm(true);
              },
            },
          );
        }}
      />

      <Popup
        visible={showReportConfirm}
        title="신고가 완료되었습니다"
        description="빠르게 검토 후 조치하겠습니다"
        onConfirm={() => setShowReportConfirm(false)}
      />

      {showDeletePopup && (
        <AlertPopup
          visible={showDeletePopup}
          title="글을 삭제하시겠습니까?"
          description="삭제한 글은 복구할 수 없습니다"
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={() => {
            setShowDeletePopup(false);
            if (!post?.postId) return;
            deleteMutate(
              {
                postId: post.postId,
                restaurantId: restaurantId ?? "",
              },
              { onSuccess: () => router.back() },
            );
          }}
          cancelText="취소"
          confirmText="확인"
        />
      )}

      <Modal
        visible={showCommentMenuPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCommentMenuPopup(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.1)" }}
          onPress={() => setShowCommentMenuPopup(false)}
        >
          <View
            style={{
              position: "absolute",
              top: commentMenuPopupPosition.top,
              left: commentMenuPopupPosition.left,
            }}
          >
            <Pressable
              onPress={(e: GestureResponderEvent) => e.stopPropagation()}
            >
              <ActionPopup
                options={
                  commentMenuTarget?.isMine
                    ? [
                        {
                          label: "수정하기",
                          color: "text-gray-800",
                          onPress: handleCommentEditPress,
                        },
                        {
                          label: "삭제하기",
                          color: "text-red-700",
                          onPress: handleCommentDeletePress,
                        },
                      ]
                    : [
                        {
                          label: "신고하기",
                          color: "text-gray-800",
                          onPress: handleCommentReportPress,
                        },
                      ]
                }
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
        className="absolute bottom-0 left-0 right-0"
      >
        <View
          className="bg-white"
          style={{
            paddingTop: isKeyboardVisible ? 0 : 12,
            paddingBottom: isKeyboardVisible ? 0 : 32,
          }}
        >
          <ReplyInput
            value={commentText}
            onChangeText={setCommentText}
            onSubmit={onSubmitComment}
            placeholder={
              editingCommentId !== null
                ? "댓글을 수정해주세요."
                : replyTargetAuthor
                  ? `${replyTargetAuthor}님께 답글 작성...`
                  : "댓글을 작성해주세요."
            }
          />
        </View>
      </KeyboardAvoidingView>

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
