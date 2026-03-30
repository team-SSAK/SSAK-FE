import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";

import ActionPopup from "@/components/actionpopup";
import Post from "@/components/post";
import SearchInput from "@/components/searchinput";

import ChevronDown from "../../assets/images/chevron-down.svg";

import Pen from "../../assets/images/pen.svg";
import SearchB from "../../assets/images/searchB.svg";
import { useCommunity, useDeleteCommunity } from "../../src/hooks/useCommunity";
import { useMe } from "../../src/hooks/useMe";
import { useReport } from "../../src/hooks/useReport";

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
              className="flex-1 h-10 px-2 py-2 bg-lime-600 rounded-[10px] justify-center items-center"
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
//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

export default function Community() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const [postFilter, setPostFilter] = useState<"all" | "mine">("all");
  const [sortLabel, setSortLabel] = useState("최신순");
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: communityPosts = [] } = useCommunity(restaurantId);
  const { mutate: deletePost } = useDeleteCommunity();
  const { mutate: reportPost } = useReport();
  const { me } = useMe();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [sortPopupPosition, setSortPopupPosition] = useState({
    top: 0,
    left: 0,
  });

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

  const formatPostDate = (isoDate: string) => {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yy}.${mm}.${dd}`;
  };

  const filteredPosts = useMemo(() => {
    const myNickname = (me?.userNm ?? "").trim();

    const visiblePosts = communityPosts.filter((post) => {
      const isMine =
        myNickname.length > 0 && post.nickname.trim() === myNickname;
      return post.postVisibility || isMine;
    });

    if (postFilter === "all") {
      return visiblePosts;
    }

    if (!myNickname) {
      return [];
    }

    return visiblePosts.filter((post) => post.nickname.trim() === myNickname);
  }, [communityPosts, me?.userNm, postFilter]);

  const searchedPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) {
      return filteredPosts;
    }

    return filteredPosts.filter((post) => {
      const author = (post.nickname ?? "").toLowerCase();
      const title = (post.postTitle ?? "").toLowerCase();
      const content = (post.postContent ?? "").toLowerCase();

      return author.includes(q) || title.includes(q) || content.includes(q);
    });
  }, [filteredPosts, searchQuery]);

  const sortedPosts = useMemo(() => {
    const posts = [...searchedPosts];

    if (sortLabel === "인기순") {
      posts.sort(
        (a, b) =>
          b.postLikeCnt + b.postCommentCnt - (a.postLikeCnt + a.postCommentCnt),
      );
      return posts;
    }

    if (sortLabel === "오래된순") {
      posts.sort(
        (a, b) =>
          new Date(a.postCreateTime).getTime() -
          new Date(b.postCreateTime).getTime(),
      );
      return posts;
    }

    posts.sort(
      (a, b) =>
        new Date(b.postCreateTime).getTime() -
        new Date(a.postCreateTime).getTime(),
    );
    return posts;
  }, [searchedPosts, sortLabel]);

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

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 40,
        }}
      >
        {/* 헤더 */}
        <View className="flex flex-row justify-between items-center">
          <View className="py-4 flex-row gap-2 items-center flex-1">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft />
            </TouchableOpacity>
            {isSearchMode ? (
              <View className="flex-1">
                <SearchInput
                  placeholder="게시글을 검색해주세요."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  onBlur={() => setIsSearchMode(false)}
                />
              </View>
            ) : (
              <Text className="text-gray-800 text-xl font-semibold">
                식당 커뮤니티
              </Text>
            )}
          </View>
          {!isSearchMode && (
            <View className="flex flex-row gap-2.5">
              <TouchableOpacity onPress={() => setIsSearchMode(true)}>
                <SearchB />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/home/writepost",
                    params: { restaurantId },
                  })
                }
              >
                <Pen />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="py-4 flex flex-row gap-2.5">
          <TouchableOpacity
            onPress={() => setPostFilter("all")}
            className={`px-4 py-1 rounded-[999px] inline-flex justify-center items-center ${postFilter === "all" ? "bg-gray-600" : "bg-gray-100"}`}
          >
            <Text
              className={`text-sm font-semibold leading-6 ${postFilter === "all" ? "text-white" : "text-gray-500"}`}
            >
              전체
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPostFilter("mine")}
            className={`px-4 py-1 rounded-[999px] inline-flex justify-center items-center ${postFilter === "mine" ? "bg-gray-600" : "bg-gray-100"}`}
          >
            <Text
              className={`text-sm font-semibold leading-6 ${postFilter === "mine" ? "text-white" : "text-gray-500"}`}
            >
              나의 글
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between items-center">
          <Text className="text-base text-gray-500 font-semibold leading-6">
            전체 {sortedPosts.length}
          </Text>
          <TouchableOpacity
            onPress={onOpenSortPopup}
            className="flex flex-row gap-0.5 items-center"
          >
            <Text className="text-base text-gray-500 font-semibold leading-6">
              {sortLabel}
            </Text>
            <ChevronDown width="18px" height="18px" />
          </TouchableOpacity>
        </View>

        {sortedPosts.map((post) => (
          <Post
            key={post.postId}
            showBadge={!post.postVisibility}
            badge="비공개"
            author={post.nickname}
            title={post.postTitle}
            content={post.postContent}
            image={post.imageUrls?.[0]}
            likedPostId={post.postId}
            likeCount={post.postLikeCnt}
            commentCount={post.postCommentCnt}
            date={formatPostDate(post.postCreateTime)}
            isMine={post.nickname.trim() === (me?.userNm ?? "").trim()}
            onDeletePress={() => {
              if (!restaurantId) return;
              deletePost({
                postId: post.postId,
                restaurantId,
              });
            }}
            onEditPress={() => {
              router.push({
                pathname: "/home/writepost",
                params: {
                  restaurantId: String(restaurantId ?? ""),
                  postId: String(post.postId),
                  postTitle: post.postTitle ?? "",
                  postContent: post.postContent,
                  postVisibility: String(post.postVisibility),
                  postImages: JSON.stringify(post.imageUrls ?? []),
                },
              });
            }}
            onReportPress={() => {
              reportPost(
                {
                  postId: post.postId,
                  reportContent: post.postContent,
                },
                {
                  onError: (error) => {
                    if (isDuplicateReportError(error)) {
                      setShowReportPopup(true);
                    }
                  },
                },
              );
            }}
            onPress={() =>
              router.push({
                pathname: "/home/post",
                params: {
                  postId: String(post.postId),
                  restaurantId: String(restaurantId ?? ""),
                  postTitle: post.postTitle ?? "",
                  postContent: post.postContent,
                  nickname: post.nickname,
                  postCreateTime: post.postCreateTime,
                  postLikeCnt: String(post.postLikeCnt),
                  postCommentCnt: String(post.postCommentCnt),
                  postImage: post.imageUrls?.[0] ?? "",
                  postImages: JSON.stringify(post.imageUrls ?? []),
                },
              })
            }
          />
        ))}
      </ScrollView>

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

      <Popup
        visible={showReportPopup}
        onConfirm={() => setShowReportPopup(false)}
      />

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
