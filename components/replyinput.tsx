import { useEffect, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableOpacity,
  View,
} from "react-native";
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
  const MIN_INPUT_HEIGHT = 24;
  const MAX_INPUT_HEIGHT = 144;

  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);

  useEffect(() => {
    const text = value ?? "";

    if (text.length === 0) {
      setInputHeight(MIN_INPUT_HEIGHT);
      return;
    }

    // Fallback shrink path: when content-size events are delayed/missed,
    // keep height in sync with explicit line breaks.
    const lineCount = text.split("\n").length;
    const lineBasedHeight = Math.max(
      MIN_INPUT_HEIGHT,
      Math.min(MAX_INPUT_HEIGHT, lineCount * MIN_INPUT_HEIGHT),
    );

    setInputHeight((prev) =>
      Math.max(lineBasedHeight, Math.min(prev, MAX_INPUT_HEIGHT)),
    );
  }, [value]);

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const nextHeight = Math.max(
      MIN_INPUT_HEIGHT,
      Math.min(MAX_INPUT_HEIGHT, event.nativeEvent.contentSize.height),
    );

    if (Math.abs(nextHeight - inputHeight) > 1) {
      setInputHeight(nextHeight);
    }
  };

  return (
    <View className="self-stretch px-2.5 py-3 bg-white border-t border-gray-50 flex-col justify-start items-start gap-2.5">
      <View className="self-stretch px-2.5 py-2 bg-gray-50 rounded-xl flex-row justify-start items-end gap-2.5">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onContentSizeChange={handleContentSizeChange}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          className="flex-1 text-gray-700 text-base font-medium leading-6"
          style={{
            minHeight: MIN_INPUT_HEIGHT,
            height: inputHeight,
            maxHeight: MAX_INPUT_HEIGHT,
            textAlignVertical: "top",
            paddingVertical: 0,
          }}
          multiline
          scrollEnabled={inputHeight >= MAX_INPUT_HEIGHT}
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
