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
  const dividerColor = dark ? "#1f2937" : "#F5F7FA";

  return (
    <View
      className="w-[210px] rounded-[14px] overflow-hidden flex-col"
      style={{
        backgroundColor: containerBg,
        zIndex: 999,
      }}
    >
      {options.map((option, index) => (
        <View key={index}>
          <TouchableOpacity
            onPress={option.onPress}
            style={{
              backgroundColor: containerBg,
            }}
            className="self-stretch px-[10px] py-3 justify-center items-center"
          >
            <Text
              className={`text-base font-medium leading-6 ${option.color ?? (dark ? "text-white" : "text-gray-800")}`}
              style={{ lineHeight: 25.6 }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>

          {index < options.length - 1 ? (
            <View
              style={{
                height: 1,
                backgroundColor: dividerColor,
              }}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}
