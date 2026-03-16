import { useEffect, useMemo, useState } from "react";
import { Platform, TextInput as RNTextInput, View } from "react-native";

interface TextInputProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
  value?: string;
  multiline?: boolean;
}

export default function TextInput({
  placeholder,
  onChangeText,
  value,
  multiline = false,
}: TextInputProps) {
  const ONE_LINE_HEIGHT = 24;
  const [internalValue, setInternalValue] = useState("");
  const [inputHeight, setInputHeight] = useState(ONE_LINE_HEIGHT);
  const currentValue = useMemo(
    () => (value !== undefined ? value : internalValue),
    [value, internalValue],
  );

  const handleChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setInternalValue(text);
    }
  };

  const handleContentSizeChange = (event: any) => {
    if (!multiline) return;
    const nextHeight = Math.max(
      ONE_LINE_HEIGHT,
      Math.ceil(event?.nativeEvent?.contentSize?.height ?? ONE_LINE_HEIGHT),
    );
    setInputHeight(nextHeight);
  };

  useEffect(() => {
    if (!multiline) return;
    if (!currentValue) {
      setInputHeight(ONE_LINE_HEIGHT);
    }
  }, [currentValue, multiline]);

  return (
    <View className="self-stretch p-4 bg-gray-100 rounded-lg justify-start">
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280" // gray-500
        className="text-gray-900 font-medium leading-6"
        onChangeText={handleChange}
        value={currentValue}
        multiline={multiline}
        numberOfLines={1}
        onContentSizeChange={handleContentSizeChange}
        scrollEnabled={!multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={multiline ? { height: inputHeight } : undefined}
        showSoftInputOnFocus={Platform.OS === "android" ? true : undefined}
      />
    </View>
  );
}
