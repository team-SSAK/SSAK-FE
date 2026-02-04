import { TextInput as RNTextInput, View } from "react-native";

interface TextInputProps {
  placeholder: string;
}

export default function TextInput({ placeholder }: TextInputProps) {
  return (
    <View className="self-stretch p-4 bg-gray-100 rounded-lg justify-start">
      <RNTextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280" // gray-500
        className="text-gray-900 font-medium leading-6"
      />
    </View>
  );
}
