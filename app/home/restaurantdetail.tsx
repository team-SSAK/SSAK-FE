import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ChevronLeft from "../../assets/images/chevron-left.svg";
import ChevronRightG from "../../assets/images/chevron-right-gray.svg";
import Map from "../../assets/images/map.svg";

import Post from "../../components/post";

import { useCommunity, useDeleteCommunity } from "../../src/hooks/useCommunity";
import { useMe } from "../../src/hooks/useMe";
import { useRestaurantWish } from "../../src/hooks/useRestaurantWish";

//////////////////////////////////////////////////////
// 타입
//////////////////////////////////////////////////////

interface RestaurantWishResponse {
  restaurantWishId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantImgUrl: string;
  restaurantType?: string | null;
}

//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

export default function RestaurantDetail() {
  const { data } = useRestaurantWish();
  const { restaurantId, restaurantImage, restaurantType } =
    useLocalSearchParams<{
      restaurantId?: string;
      restaurantImage?: string;
      restaurantType?: string;
    }>();

  const restaurants = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item: RestaurantWishResponse) => ({
      id: item.restaurantId,
      name: item.restaurantName,
      address: item.restaurantLocation,
      image: item.restaurantImgUrl,
      type: item.restaurantType ?? null,
    }));
  }, [data]);

  const selectedRestaurantId =
    typeof restaurantId === "string" ? Number(restaurantId) : NaN;

  const selectedRestaurant = useMemo(
    () =>
      restaurants.find((restaurant) => restaurant.id === selectedRestaurantId),
    [restaurants, selectedRestaurantId],
  );

  const detailImage =
    typeof restaurantImage === "string" && restaurantImage.length > 0
      ? restaurantImage
      : selectedRestaurant?.image;

  const selectedRestaurantType =
    restaurantType === "null"
      ? null
      : typeof restaurantType === "string" && restaurantType.length > 0
        ? restaurantType
        : (selectedRestaurant?.type ?? null);

  const restaurantTypeLabel =
    selectedRestaurantType === null ? "자율배식형" : selectedRestaurantType;

  const { data: communityPosts = [] } = useCommunity(restaurantId);
  const { mutate: deletePost } = useDeleteCommunity();
  const { me } = useMe();

  const visibleCommunityPosts = useMemo(() => {
    const myNickname = (me?.userNm ?? "").trim();

    return communityPosts.filter((post) => {
      const isMine =
        myNickname.length > 0 && post.nickname.trim() === myNickname;
      return post.postVisibility || isMine;
    });
  }, [communityPosts, me?.userNm]);

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

  // 기본값: 전부 채워진 하트
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    if (restaurants.length > 0) {
      const initialState = Object.fromEntries(
        restaurants.map((r) => [r.id, true]),
      );
      setSelectedRestaurants(initialState);
    }
  }, [restaurants]);

  const toggle = (id: number) => {
    setSelectedRestaurants((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

        {detailImage ? (
          <Image
            source={{ uri: detailImage }}
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
            {selectedRestaurant?.name ?? "식당 정보"}
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
                {selectedRestaurant?.address ?? "식당 주소"}
              </Text>
              <Text className="text-gray-600 text-sm font-semibold leading-6 line-clamp-2">
                07:00 - 21:30
              </Text>
            </View>
          </View>
        </View>

        <View className="h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-100 my-[30px]"></View>

        {/* 내용 */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/home/menu",
              params: typeof restaurantId === "string" ? { restaurantId } : {},
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
            {/* Hardcoded Menu Cards */}
            <View className="self-start w-64 p-3.5 bg-gray-50 rounded-[10px] flex flex-col justify-center items-start gap-2.5">
              <View className="self-stretch flex flex-col justify-start items-start gap-7">
                <Text className="self-stretch text-gray-800 text-sm font-semibold leading-6">
                  중식
                </Text>
                <Text
                  className="self-stretch text-gray-500 text-sm font-medium leading-6"
                  numberOfLines={2}
                >
                  제육볶음, 쌀밥, 미역국 김치찌개, 요구르트, 제육볶음, 쌀밥,
                  미역국 김치찌개, 요구르트,요구르트
                </Text>
              </View>
            </View>

            <View className="self-start w-64 p-3.5 bg-gray-50 rounded-[10px] flex flex-col justify-center items-start gap-2.5">
              <View className="self-stretch flex flex-col justify-start items-start gap-7">
                <Text className="self-stretch text-gray-800 text-sm font-semibold leading-6">
                  중식
                </Text>
                <Text
                  className="self-stretch text-gray-500 text-sm font-medium leading-6"
                  numberOfLines={2}
                >
                  제육볶음, 쌀밥, 미역국 김치찌개, 요구르트, 제육볶음, 쌀밥,
                  미역국 김치찌개, 요구르트,요구르트
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableOpacity>

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
            author={post.nickname}
            //title={post.postTitle}
            content={post.postContent}
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
            onReportPress={() => {
              // TODO: 신고 API 연결 시 이 콜백에서 호출
            }}
            onPress={() =>
              router.push({
                pathname: "/home/post",
                params: {
                  postId: String(post.postId),
                  restaurantId,
                },
              })
            }
          />
        ))}
      </ScrollView>

      {/* 하단 그라디언트 */}
      <View className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        <View className="flex-1 bg-gradient-to-b from-white/0 to-white/90" />
      </View>

      {/* 잔반 인증 버튼 */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-[56px]">
        <TouchableOpacity>
          <View className="h-[52px] p-3 bg-green-400 rounded-xl justify-center items-center">
            <Text className="text-center text-gray-50 text-lg font-medium leading-7">
              잔반 인증하러 가기
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
