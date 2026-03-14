import { useState } from "react";
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
import Heart from "../assets/images/lineheart.svg";
import Message from "../assets/images/message.svg";
import ActionPopup from "./actionpopup";

interface MockPostProps {
  showBadge?: boolean;
  badge?: string;
  author?: string;
  title?: string;
  content?: string;
  image?: string;
  likeCount?: number;
  commentCount?: number;
  date?: string;
  onMenuPress?: () => void;
  onPress?: () => void;
}

export default function MockPost({
  showBadge = true,
  badge = "비공개",
  author = "화여니",
  title = "오늘의 메뉴!",
  content = "오늘 식당 메뉴 최고네요! 넘 맛있어요!",
  image,
  likeCount = 0,
  commentCount = 0,
  date = "25.11.14",
  onMenuPress,
  onPress,
}: MockPostProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleMenuPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const popupWidth = 208; // w-52
    const horizontalMargin = 16;

    // Align popup right edge to the trigger button and clamp into the viewport.
    const rawLeft = pageX - popupWidth + 16;
    const clampedLeft = Math.min(
      screenWidth - popupWidth - horizontalMargin,
      Math.max(horizontalMargin, rawLeft),
    );

    setMenuPosition({
      top: pageY + 8,
      left: clampedLeft,
    });
    setShowMenu(true);
    onMenuPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      className="self-stretch py-4 bg-white border-b border-gray-100 flex flex-col justify-start items-start"
    >
      <View className="self-stretch flex flex-col justify-start items-start gap-2">
        {/* 배지 */}
        {showBadge && (
          <View className="px-2.5 py-0.5 bg-gray-200 rounded-md justify-center items-center">
            <Text className="text-gray-500 text-xs font-semibold leading-5">
              {badge}
            </Text>
          </View>
        )}

        {/* 작성자 */}
        <View className="self-stretch flex-row justify-start items-start gap-2">
          <View className="flex-1 flex-row items-center gap-2">
            <User width="30px" height="30px" />
            <Text className="text-gray-700 text-base font-semibold leading-6">
              {author}
            </Text>
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
          <Image
            source={{ uri: "https://placehold.co/68x68" }}
            className="w-16 h-16 rounded-md"
          />
        </View>

        {/* 좋아요 / 댓글 / 날짜 */}
        <View className="self-stretch flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-0.5">
              <Heart width="20px" height="20px" />
              <Text className="text-gray-500 text-sm font-medium leading-6">
                {likeCount}
              </Text>
            </View>
            <View className="flex-row items-center gap-0.5">
              <Message width="20px" height="20px" />
              <Text className="text-gray-500 text-sm font-medium leading-6">
                {commentCount}
              </Text>
            </View>
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
                options={[
                  {
                    label: "수정하기",
                    color: "text-gray-800",
                    onPress: () => setShowMenu(false),
                  },
                  {
                    label: "삭제하기",
                    color: "text-red-700",
                    onPress: () => setShowMenu(false),
                  },
                ]}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
}
