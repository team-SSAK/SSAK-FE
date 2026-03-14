import { Text, TouchableOpacity, View } from "react-native";
import User from "../assets/images/avatar.svg";
import Heart from "../assets/images/lineheart.svg";
import Message from "../assets/images/message.svg";

interface CommentCardProps {
  author?: string;
  content?: string;
  likeCount?: number;
  date?: string;
  onMenuPress?: () => void;
  onReplyPress?: () => void;
}

export default function CommentCard({
  author = "화여니",
  content = "오늘 식당 메뉴 최고네요!",
  likeCount = 0,
  date = "25.11.14",
  onMenuPress,
  onReplyPress,
}: CommentCardProps) {
  return (
    <View className="self-stretch py-4 bg-white border-b border-gray-100 flex-col justify-start items-start">
      <View className="self-stretch flex-col justify-start items-start gap-2">
        {/* 작성자 */}
        <View className="self-stretch flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center gap-2">
            <User width="28px" height="28px" />
            <Text className="text-gray-700 text-base font-semibold leading-6">
              {author}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onMenuPress}
            className="w-4 h-4 justify-center items-center"
          >
            <Text className="text-gray-500 text-lg leading-none tracking-widest">
              ...
            </Text>
          </TouchableOpacity>
        </View>

        {/* 내용 */}
        <Text className="self-stretch text-gray-700 text-base font-medium leading-6">
          {content}
        </Text>

        {/* 하단 액션 */}
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            {/* 답글달기 */}
            <TouchableOpacity
              onPress={onReplyPress}
              className="flex-row items-center gap-0.5"
            >
              <Message width="20px" height="20px" />
              <Text className="text-gray-500 text-sm font-medium leading-6">
                답글달기
              </Text>
            </TouchableOpacity>
            {/* 좋아요 */}
            <View className="flex-row items-center gap-0.5">
              <Heart width="20px" height="20px" />
              <Text className="text-gray-500 text-sm font-medium leading-6">
                {likeCount}
              </Text>
            </View>
          </View>

          <View className="w-px h-3 bg-gray-300" />

          <Text className="text-gray-500 text-sm font-medium leading-6">
            {date}
          </Text>
        </View>
      </View>
    </View>
  );
}
