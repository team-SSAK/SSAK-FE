import { Text, TouchableOpacity, View } from "react-native";

interface ActionOption {
  label: string;
  color?: string;
  onPress?: () => void;
}

interface ActionPopupProps {
  options?: ActionOption[];
  dark?: boolean;
}

export default function ActionPopup({
  options = [
    { label: "수정하기", color: "text-gray-800" },
    { label: "삭제하기", color: "text-red-700" },
  ],
  dark = false,
}: ActionPopupProps) {
  const containerBg = dark ? "#111827" : "#ffffff";
  const containerBorder = dark ? "#111827" : "#f3f4f6";
  const itemBorder = dark ? "#1f2937" : "#f9fafb";

  return (
    <View
      className="w-52 rounded-2xl flex-col"
      style={{
        backgroundColor: containerBg,
        borderColor: containerBorder,
        borderWidth: 1,
        zIndex: 999,
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={option.onPress}
          style={{
            backgroundColor: containerBg,
            borderBottomWidth: index === options.length - 1 ? 0 : 1,
            borderBottomColor: itemBorder,
            borderRadius:
              index === 0
                ? 16 // 첫 번째
                : index === options.length - 1
                  ? 16 // 마지막
                  : 0,
          }}
          className="self-stretch px-2.5 py-3 justify-center items-center flex-row gap-2.5"
        >
          <Text
            className={`text-base font-medium leading-6 ${option.color ?? (dark ? "text-white" : "text-gray-800")}`}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
