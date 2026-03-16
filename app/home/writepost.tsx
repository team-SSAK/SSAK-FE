import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Image from "../../assets/images/image.svg";

function PublicToggle({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-1 py-1.5 flex flex-row items-center gap-3"
    >
      <View
        className={`w-5 h-5 bg-white rounded-full ${
          selected ? "border-[6px] border-lime-600" : "border border-slate-300"
        }`}
      />
      <Text className="text-black text-base font-medium leading-6">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function WritePost() {
  const [isPublic, setIsPublic] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View className="flex-1 pt-[72px] pb-[56px] px-4">
        <View className="flex flex-col justify-between flex-1">
          <View>
            <View className="py-3 flex flex-row justify-between">
              <View className="px-1 py-1.5">
                <Text className="text-gray-700 text-sm font-medium leading-6">
                  취소
                </Text>
              </View>
              <Text className="text-gray-900 text-xl font-semibold leading-8">
                글쓰기
              </Text>
              <View className="px-1 py-1.5">
                <Text className="text-green-600 text-sm font-medium leading-6">
                  취소
                </Text>
              </View>
            </View>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력해주세요."
              placeholderTextColor="#94A3B8"
              className="text-gray-900 text-xl font-semibold leading-8"
            />
            <View className="my-3 self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-100" />
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="구내식당 리뷰와 무관한 비난, 부적절한 글 또는 욕설 사용시 별도의 안내 없이 글이 삭제될 수 있습니다."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              className="text-gray-900 font-medium leading-6 min-h-[120px]"
            />
          </View>

          {/* 하단 바 */}
          <View className="border-t border-slate-100 flex flex-row justify-between items-center py-2">
            {/* 이미지 버튼 */}
            <View className="flex flex-row items-center gap-1">
              <Image />
              <Text className="text-black text-base font-medium leading-6">
                이미지
              </Text>
            </View>

            {/* 공개/비공개 라디오 */}
            <View className="flex flex-row items-center gap-2.5">
              <PublicToggle
                label="공개"
                selected={isPublic}
                onPress={() => setIsPublic(true)}
              />
              <PublicToggle
                label="비공개"
                selected={!isPublic}
                onPress={() => setIsPublic(false)}
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
