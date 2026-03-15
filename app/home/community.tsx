import { router } from "expo-router";
import { useState } from "react";
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
import MockPost from "@/components/mockpost";
import SearchInput from "@/components/searchinput";

import ChevronDown from "../../assets/images/chevron-down.svg";

import Pen from "../../assets/images/pen.svg";
import SearchB from "../../assets/images/searchB.svg";
//////////////////////////////////////////////////////
// 페이지
//////////////////////////////////////////////////////

export default function Community() {
  const [sortLabel, setSortLabel] = useState("최신순");
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
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
                <SearchInput placeholder="게시글을 검색해주세요." />
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
              <TouchableOpacity onPress={() => router.push("/home/writepost")}>
                <Pen />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="py-4 flex flex-row gap-2.5">
          <View className="px-4 py-1 bg-gray-600 rounded-[999px] inline-flex justify-center items-center">
            <Text className="text-white text-sm font-semibold leading-6">
              전체
            </Text>
          </View>
          <View className="px-4 py-1 bg-gray-100 rounded-[999px] inline-flex justify-center items-center">
            <Text className="text-gray-500 text-sm font-semibold leading-6">
              나의 글
            </Text>
          </View>
        </View>

        <View className="flex flex-row justify-between items-center">
          <Text className="text-gray-500 font-semibold leading-6">전체 20</Text>
          <TouchableOpacity
            onPress={onOpenSortPopup}
            className="flex flex-row gap-0.5 items-center"
          >
            <Text className="text-gray-500 font-semibold leading-6">
              {sortLabel}
            </Text>
            <ChevronDown width="18px" height="18px" />
          </TouchableOpacity>
        </View>

        <MockPost onPress={() => router.push("/home/post")} />
        <MockPost showBadge={false} onPress={() => router.push("/home/post")} />
        <MockPost showBadge={false} onPress={() => router.push("/home/post")} />
        <MockPost showBadge={false} onPress={() => router.push("/home/post")} />
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
