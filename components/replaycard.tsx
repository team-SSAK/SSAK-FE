import { Text, TouchableOpacity, View } from "react-native";
import User from "../assets/images/avatar.svg";
import Heart from "../assets/images/lineheart.svg";
import Reply from "../assets/images/reply.svg";

interface ReplyCardProps {
  author?: string;
  content?: string;
  likeCount?: number;
  date?: string;
  onMenuPress?: () => void;
}

export default function ReplyCard({
  author = "화여니",
  content = "오늘 식당 메뉴 최고네요!",
  likeCount = 0,
  date = "25.11.14",
  onMenuPress,
}: ReplyCardProps) {
  return (
    <View className="self-stretch py-3.5 bg-white border-b border-gray-100 flex-row justify-start items-start">
      {/* 들여쓰기 인디케이터 */}
      <View className="px-2 py-2 opacity-80 rounded-sm justify-start items-start">
        <Reply />
      </View>

      {/* 내용 */}
      <View className="flex-1 flex-col justify-start items-start gap-1.5">
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

        {/* 댓글 내용 */}
        <Text className="self-stretch text-gray-700 text-base font-medium leading-6">
          {content}
        </Text>

        {/* 하단 액션 */}
        <View className="self-stretch flex-row items-center gap-2">
          <View className="flex-row items-center gap-0.5">
            <Heart width="20px" height="20px" />
            <Text className="text-gray-500 text-sm font-medium leading-6">
              {likeCount}
            </Text>
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
