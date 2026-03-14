import { TextInput, TouchableOpacity, View } from "react-native";
import Send from "../assets/images/send.svg";

interface ReplyInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export default function ReplyInput({
  value,
  onChangeText,
  onSubmit,
  placeholder = "댓글을 작성해주세요.",
}: ReplyInputProps) {
  return (
    <View className="self-stretch px-2.5 py-3 bg-white border-t border-gray-50 flex-col justify-start items-start gap-2.5">
      <View className="self-stretch px-2.5 py-2 bg-gray-50 rounded-xl flex-row justify-start items-center gap-2.5">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          className="flex-1 text-gray-500 text-base font-medium leading-6"
          multiline
        />
        <TouchableOpacity
          onPress={onSubmit}
          className="w-6 h-6 justify-center items-center"
        >
          <Send width="16px" height="16px" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
