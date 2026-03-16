import {
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from "react-native";

import Add from "../assets/images/add.svg";

type AddBtnProps = TouchableOpacityProps;

export default function AddBtn({ style, ...props }: AddBtnProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      className="p-4 bg-green-300 rounded-[999px] inline-flex justify-start items-center"
      style={[
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        },
        style,
      ]}
      {...props}
    >
      <View className="w-8 h-8 relative overflow-hidden">
        <Add />
      </View>
    </TouchableOpacity>
  );
}
