import { useState } from "react";
import { Platform, TextInput as RNTextInput, View } from "react-native";

interface TextInputProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

export default function TextInput({
  placeholder,
  onChangeText,
  value,
}: TextInputProps) {
  const [internalValue, setInternalValue] = useState("");

  const handleChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setInternalValue(text);
    }
  };

  return (
    <View className="self-stretch p-4 bg-gray-100 rounded-lg justify-start">
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280" // gray-500
        className="text-gray-900 font-medium leading-6"
        onChangeText={handleChange}
        value={value !== undefined ? value : internalValue}
        showSoftInputOnFocus={Platform.OS === "android" ? true : undefined}
      />
    </View>
  );
}
