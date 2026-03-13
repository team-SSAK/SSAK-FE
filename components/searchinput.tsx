import { Text, View } from "react-native";
import Search from "../assets/images/search.svg";

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({
  placeholder = "궁금한 점을 검색해보세요.",
}: SearchInputProps) {
  return (
    <View className="flex flex-row px-2.5 py-2 bg-gray-50 rounded-xl justify-between items-center">
      <Text className="text-gray-500 font-medium leading-6">{placeholder}</Text>
      <Search />
    </View>
  );
}
