import { useState } from "react";
import { Platform, TextInput as RNTextInput, View } from "react-native";
import Search from "../assets/images/search.svg";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchInput({
  placeholder = "궁금한 점을 검색해보세요.",
  value,
  onChangeText,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("");

  const handleChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setInternalValue(text);
    }
  };

  return (
    <View className="flex flex-row px-2.5 py-2 bg-gray-50 rounded-xl justify-between items-center">
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        className="flex-1 text-gray-700 font-medium leading-6"
        value={value !== undefined ? value : internalValue}
        onChangeText={handleChange}
        autoCapitalize="none"
        showSoftInputOnFocus={Platform.OS === "android" ? true : undefined}
      />
      <Search />
    </View>
  );
}
