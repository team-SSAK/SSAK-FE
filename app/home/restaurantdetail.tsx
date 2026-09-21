import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import ChevronRightG from "../../assets/images/chevron-right-gray.svg";
import Map from "../../assets/images/map.svg";

import AlertPopupRadio from "@/components/alertpopupradio";
import AlertPopup from "../../components/alertpopup";
import OutOfRangeModal from "../../components/outofrangemodal";
import PopUp from "../../components/popup";
import Post from "../../components/post";

import { useCommunity, useDeleteCommunity } from "../../src/hooks/useCommunity";
import { useMe } from "../../src/hooks/useMe";
import { useReport } from "../../src/hooks/useReport";
import {
  useRestaurantDetail,
  useRestaurantMenu,
} from "../../src/hooks/useRestaurant";
import { getItem } from "../../src/utils/storage";

function Popup({
  title = "이미 신고된 글입니다",
  description = "현재 검토가 진행중입니다",
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
    <Modal transparent visible={visible}>
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
      >
        <View className="w-[284px] p-5 bg-white rounded-[20px] flex-col justify-center items-center gap-4">
          <View className="self-stretch flex-col justify-start items-start gap-1">
            <Text className="self-stretch text-gray-900 text-lg font-semibold leading-7">
              {title}
            </Text>
            <Text className="self-stretch text-gray-600 text-sm font-medium leading-[22px]">
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

//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

export default function RestaurantDetail() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const restaurantIdValue = Number(
    Array.isArray(restaurantId) ? restaurantId[0] : restaurantId,
  );
  const isValidRestaurantId =
    Number.isFinite(restaurantIdValue) && restaurantIdValue > 0;

  const { data: restaurantDetail } = useRestaurantDetail(
    isValidRestaurantId ? restaurantIdValue : NaN,
  );
  const { data: restaurantMenus = [] } = useRestaurantMenu(
    isValidRestaurantId ? restaurantIdValue : NaN,
  );

  const restaurantTypeLabel =
    restaurantDetail?.restaurantType === "FREESTYLE"
      ? "자율배식형"
      : restaurantDetail?.restaurantType === "FOODCOURT"
        ? "푸드코트형"
        : (restaurantDetail?.restaurantType ?? "자율배식형");

  const formatTime = (time: unknown): string | null => {
    if (typeof time === "string") {
      const [hour, minute] = time.split(":");
      const h = Number(hour);
      const m = Number(minute);

      if (Number.isFinite(h) && Number.isFinite(m)) {
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      }

      return null;
    }

    if (typeof time !== "object" || time === null) {
      return null;
    }

    const obj = time as { hour?: unknown; minute?: unknown };
    const h = Number(obj.hour);
    const m = Number(obj.minute);

    if (!Number.isFinite(h) || !Number.isFinite(m)) {
      return null;
    }

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const openTime = formatTime(restaurantDetail?.openTime ?? null);
  const closeTime = formatTime(restaurantDetail?.closeTime ?? null);
  const operatingHours =
    openTime && closeTime ? `${openTime} - ${closeTime}` : "운영시간 정보 없음";

  const getMenuTypeLabel = (menuType: string) => {
    if (menuType === "BREAKFAST") return "아침";
    if (menuType === "LUNCH") return "점심";
    if (menuType === "DINNER") return "저녁";
    return menuType;
  };

  const getAuthorDisplayName = (nickname: string) => {
    const trimmed = nickname.trim();
    return trimmed.length > 0 ? trimmed : "탈퇴한 사용자";
  };

  const { data: communityPosts = [] } = useCommunity(restaurantId);
  const { mutate: deletePost } = useDeleteCommunity();
  const { mutate: reportPost } = useReport();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [pendingDeletePostId, setPendingDeletePostId] = useState<number | null>(
    null,
  );
  const [pendingReportPostId, setPendingReportPostId] = useState<
    number | string | null
  >(null);
  const { me } = useMe();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [showOutOfRangeModal, setShowOutOfRangeModal] = useState(false);
  const [showGpsFailModal, setShowGpsFailModal] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [limitPopupTitle, setLimitPopupTitle] = useState("");
  const [limitPopupMessage, setLimitPopupMessage] = useState("");
  const [displayTime, setDisplayTime] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const MEASUREMENT_LIMIT_KEY = "MEASUREMENT_LIMIT";
  const MEASUREMENT_INTERVAL_MS = 4 * 60 * 60 * 1000;
  const MEASUREMENTS_PER_DAY = 3;

  const getTodayMeasurementTimes = async (): Promise<number[]> => {
    try {
      const stored = await getItem(MEASUREMENT_LIMIT_KEY);
      if (!stored) return [];

      const data = JSON.parse(stored);
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).getTime();

      return data.filter((timestamp: number) => timestamp >= todayStart);
    } catch (e) {
      console.warn("Failed to get measurement times:", e);
      return [];
    }
  };

  const checkMeasurementLimit = async (): Promise<{
    allowed: boolean;
    title?: string;
    message?: string;
    displayTime?: string;
  }> => {
    const times = await getTodayMeasurementTimes();

    if (times.length >= MEASUREMENTS_PER_DAY) {
      return {
        allowed: false,
        title: "오늘 인증 횟수를 모두 사용했어요",
        message: "하루 최대 3번까지 인증할 수 있어요",
      };
    }

    if (times.length > 0) {
      const lastTime = Math.max(...times);
      const now = Date.now();
      const timeSinceLastMeasurement = now - lastTime;

      if (timeSinceLastMeasurement < MEASUREMENT_INTERVAL_MS) {
        const msRemaining = MEASUREMENT_INTERVAL_MS - timeSinceLastMeasurement;
        const secondsRemaining = Math.ceil(msRemaining / 1000);

        const hours = Math.floor(secondsRemaining / 3600);
        const minutes = Math.floor((secondsRemaining % 3600) / 60);
        const seconds = secondsRemaining % 60;

        const timeString = `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        return {
          allowed: false,
          title: `${timeString} 후에 다시 시도해주세요`,
          message: "인증은 4시간 간격으로 가능해요",
          displayTime: timeString,
        };
      }
    }

    return { allowed: true };
  };

  const visibleCommunityPosts = useMemo(() => {
    const myNickname = (me?.userNm ?? "").trim();

    return communityPosts.filter((post) => {
      const isMine =
        myNickname.length > 0 && post.nickname.trim() === myNickname;
      return post.postVisibility || isMine;
    });
  }, [communityPosts, me?.userNm]);

  useEffect(() => {
    if (!showLimitPopup) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    const updateTimer = async () => {
      const times = await getTodayMeasurementTimes();

      if (times.length > 0) {
        const lastTime = Math.max(...times);
        const now = Date.now();
        const timeSinceLastMeasurement = now - lastTime;

        if (timeSinceLastMeasurement < MEASUREMENT_INTERVAL_MS) {
          const msRemaining =
            MEASUREMENT_INTERVAL_MS - timeSinceLastMeasurement;
          const secondsRemaining = Math.ceil(msRemaining / 1000);

          const hours = Math.floor(secondsRemaining / 3600);
          const minutes = Math.floor((secondsRemaining % 3600) / 60);
          const seconds = secondsRemaining % 60;

          const timeString = `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
          setDisplayTime(timeString);
        }
      }
    };

    void updateTimer();
    timerIntervalRef.current = setInterval(() => {
      void updateTimer();
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [showLimitPopup]);

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

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 140,
        }}
      >
        {/* 헤더 */}
        <View className="flex flex-row justify-between items-center">
          <View className="py-4 flex-row gap-2 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft />
            </TouchableOpacity>
            <Text className="text-gray-800 text-xl font-semibold">
              식당 선택하기
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/home/restaurantlocation",
                params:
                  typeof restaurantId === "string" ? { restaurantId } : {},
              })
            }
          >
            <Map />
          </TouchableOpacity>
        </View>

        {typeof restaurantDetail?.restaurantImgUrl === "string" &&
        restaurantDetail.restaurantImgUrl.length > 0 ? (
          <Image
            source={{ uri: restaurantDetail.restaurantImgUrl }}
            className="h-[196px]"
            style={{ marginHorizontal: -16 }}
            resizeMode="cover"
          />
        ) : (
          <View
            className="h-[196px] bg-gray-400"
            style={{ marginHorizontal: -16 }}
          />
        )}

        <View className="pt-4 flex flex-col">
          <View className="self-start px-2.5 py-0.5 bg-green-300 rounded-md justify-center items-center mb-1 ">
            <Text className="text-white text-xs font-semibold leading-5">
              {restaurantTypeLabel}
            </Text>
          </View>
          <Text className="justify-start text-gray-800 text-xl font-semibold leading-8">
            {typeof restaurantDetail?.restaurantName === "string" &&
            restaurantDetail.restaurantName.length > 0
              ? restaurantDetail.restaurantName
              : "식당 정보"}
          </Text>
          <View className="flex flex-row mt-2.5 ">
            <View className="flex flex-col gap-1 mr-[19px]">
              <Text className="text-gray-500 text-sm font-semibold leading-6">
                위치
              </Text>
              <Text className="text-gray-500 text-sm font-semibold leading-6">
                운영시간
              </Text>
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-gray-600 text-sm font-semibold leading-6 line-clamp-2">
                {typeof restaurantDetail?.restaurantLocation === "string" &&
                restaurantDetail.restaurantLocation.length > 0
                  ? restaurantDetail.restaurantLocation
                  : "식당 주소"}
              </Text>
              <Text className="text-gray-600 text-sm font-semibold leading-6 line-clamp-2">
                {operatingHours}
              </Text>
            </View>
          </View>
        </View>

        <View className="h-0 outline outline-1 outline-offset-[-0.50px] outline-[#F2F2F2] my-[30px]"></View>

        {/* 메뉴 */}
        {restaurantMenus.length > 0 ? (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/home/menu",
                params:
                  typeof restaurantId === "string" ? { restaurantId } : {},
              })
            }
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-grow-0"
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ gap: 15, paddingBottom: 0 }}
            >
              {restaurantMenus.map((menu) => (
                <View
                  key={menu.menuId}
                  className="self-start w-64 p-3.5 bg-gray-50 rounded-[10px] flex flex-col justify-center items-start gap-2.5"
                >
                  <View className="self-stretch flex flex-col justify-start items-start gap-7">
                    <Text className="self-stretch text-gray-800 text-sm font-semibold leading-6">
                      {getMenuTypeLabel(menu.menuType)}
                    </Text>
                    <Text
                      className="self-stretch text-gray-500 text-sm font-medium leading-6"
                      numberOfLines={2}
                    >
                      {menu.menuItems.join(", ")}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </TouchableOpacity>
        ) : null}

        <View className="mt-[26px] flex-row justify-between">
          <Text className="text-gray-800 text-lg font-semibold">
            식당 커뮤니티
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/home/community",
                params:
                  typeof restaurantId === "string" ? { restaurantId } : {},
              })
            }
          >
            <ChevronRightG />
          </TouchableOpacity>
        </View>
        {visibleCommunityPosts.map((post) => (
          <Post
            key={post.postId}
            showBadge={!post.postVisibility}
            badge="비공개"
            author={getAuthorDisplayName(post.nickname)}
            authorImage={post.authorProfileImg ?? undefined}
            title={post.postTitle}
            content={post.postContent}
            images={post.imageUrls}
            image={post.imageUrls?.[0]}
            likedPostId={post.postId}
            likeCount={post.postLikeCnt}
            commentCount={post.postCommentCnt}
            date={formatPostDate(post.postCreateTime)}
            isMine={post.nickname.trim() === (me?.userNm ?? "").trim()}
            onDeletePress={() => {
              setShowDeletePopup(true);
              setPendingDeletePostId(post.postId);
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
              setPendingReportPostId(post.postId);
              setShowReportPopup(true);
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
                  authorProfileImg: post.authorProfileImg ?? "",
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
        {showDeletePopup && (
          <AlertPopup
            visible={showDeletePopup}
            title="글을 삭제하시겠습니까?"
            description="삭제한 글은 복구할 수 없습니다"
            onCancel={() => {
              setShowDeletePopup(false);
              setPendingDeletePostId(null);
            }}
            onConfirm={() => {
              setShowDeletePopup(false);
              if (!pendingDeletePostId || !restaurantId) return;
              deletePost({
                postId: pendingDeletePostId,
                restaurantId,
              });
              setPendingDeletePostId(null);
            }}
            cancelText="취소"
            confirmText="확인"
          />
        )}
      </ScrollView>

      {/* 하단 그라디언트 */}
      <View className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        <View className="flex-1 bg-gradient-to-b from-white/0 to-white/90" />
      </View>

      {/* 잔반 인증 버튼 */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-[56px]">
        <TouchableOpacity
          onPress={async () => {
            const limitCheck = await checkMeasurementLimit();
            if (!limitCheck.allowed) {
              setLimitPopupMessage(limitCheck.message || "다시 시도해주세요.");
              setLimitPopupTitle(limitCheck.title || "알림");
              setDisplayTime(limitCheck.displayTime || null);
              setShowLimitPopup(true);
              return;
            }
            const coord = restaurantDetail?.restaurantCoord;
            if (coord) {
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status === "granted") {
                let pos: Location.LocationObject;
                try {
                  pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                } catch {
                  setShowGpsFailModal(true);
                  return;
                }
                const R = 6371000;
                const toRad = (d: number) => (d * Math.PI) / 180;
                const dLat = toRad(coord.lat - pos.coords.latitude);
                const dLon = toRad(coord.lon - pos.coords.longitude);
                const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(pos.coords.latitude)) * Math.cos(toRad(coord.lat)) * Math.sin(dLon / 2) ** 2;
                const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                if (dist > 100) {
                  setShowOutOfRangeModal(true);
                  return;
                }
              }
            }
            router.push("/home/camera");
          }}
        >
          <View className="h-[52px] p-3 bg-green-400 rounded-xl justify-center items-center">
            <Text className="text-center text-gray-50 text-lg font-medium leading-7">
              잔반 인증하러 가기
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <AlertPopupRadio
        visible={showReportPopup}
        title="신고 사유를 선택해주세요"
        onCancel={() => {
          setShowReportPopup(false);
          setPendingReportPostId(null);
        }}
        onConfirm={() => {
          if (!pendingReportPostId) {
            setShowReportPopup(false);
            return;
          }

          setShowReportPopup(false);
          reportPost(
            {
              postId: pendingReportPostId,
              reportContent: "string",
            },
            {
              onSuccess: () => {
                setShowReportConfirm(true);
                setPendingReportPostId(null);
              },
              onError: () => {
                setPendingReportPostId(null);
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

      {showLimitPopup && (
        <PopUp
          title={
            displayTime
              ? `${displayTime} 후에 다시 시도해주세요`
              : limitPopupTitle
          }
          message={limitPopupMessage}
          onClose={() => setShowLimitPopup(false)}
        />
      )}

      <OutOfRangeModal
        visible={showOutOfRangeModal}
        onConfirm={() => setShowOutOfRangeModal(false)}
        title="식당에 도착한 후 인증할 수 있어요"
        description="선택한 식당에서 100m 이내일 때 잔반 인증이 가능해요."
      />
      <OutOfRangeModal
        visible={showGpsFailModal}
        onConfirm={() => setShowGpsFailModal(false)}
        title="위치를 확인하지 못했어요"
        description="실내나 지하에서는 위치가 정확하게 확인되지 않을 수 있어요. 잠시 후 다시 시도해 주세요."
      />
    </View>
  );
}
