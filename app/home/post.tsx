import { router } from "expo-router";
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
import LineHeart from "../../assets/images/lineheart.svg";
import Message from "../../assets/images/message.svg";

import CommentCard from "../../components/commentcard";
import ReplyCard from "../../components/replaycard";
import ReplyInput from "../../components/replyinput";

//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

export default function Post() {
  const [sortLabel, setSortLabel] = useState("최신순");
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [sortPopupPosition, setSortPopupPosition] = useState({
    top: 0,
    left: 0,
  });

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
          paddingBottom: 160,
        }}
      >
        {/* 헤더 */}

        <View className="py-4 flex-row gap-2 items-center flex-1">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-semibold">
            식당 커뮤니티
          </Text>
        </View>

        <View className="py-5 gap-3">
          <View className="flex flex-row justify-between items-start">
            <View className="flex flex-row gap-2">
              <Avatar width="30px" height="30px" />
              <Text className="text-gray-700 font-semibold leading-6">
                화여니
              </Text>
            </View>
            <Text className="text-gray-400 text-sm font-medium leading-6">
              25.11.14
            </Text>
          </View>

          <View className="gap-1.5">
            <Text className="text-gray-900 text-xl font-semibold leading-8">
              오늘의 메뉴!
            </Text>
            <Text className="text-gray-700 font-medium leading-6">
              오늘 식당 메뉴 최고네요! 넘 맛있어요! 오늘 식당 메뉴 최고네요! 넘
              맛있어요!오늘 식당 메뉴 최고네요! 넘 맛있어요!오늘 식당 메뉴
              최고네요! 넘 맛있어요!
            </Text>
          </View>

          <Image
            source={{ uri: "https://placehold.co/361x226" }}
            className="self-stretch h-56 rounded-md"
            resizeMode="cover"
          />

          <View className="flex flex-row justify-end gap-3.5">
            <View className="flex flex-row">
              <Message />
              <Text className="text-gray-500 font-medium leading-6"> 0</Text>
            </View>
            <View className="flex flex-row">
              <LineHeart />
              <Text className="text-gray-500 font-medium leading-6"> 0</Text>
            </View>
          </View>
        </View>

        <View className="h-5 bg-gray-50" />

        <CommentCard />
        <ReplyCard />
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

      <View className="absolute bottom-0 left-0 right-0 bg-white pb-[56px]">
        <ReplyInput />
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
