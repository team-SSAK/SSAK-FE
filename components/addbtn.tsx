import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

import Add from "../assets/images/add.svg";

type AddBtnProps = TouchableOpacityProps;

export default function AddBtn({ style, ...props }: AddBtnProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      className="bg-green-300 rounded-full justify-center items-center"
      style={[
        {
          width: 56,
          height: 56,
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
      <Add width={32} height={32} />
    </TouchableOpacity>
  );
}
