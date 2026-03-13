import { Text, TouchableOpacity, View } from "react-native";

interface PopUpProps {
  onClose: () => void;
  title: string;
  message: string;
}

export default function PopUp({ onClose, title, message }: PopUpProps) {
  return (
    <View
      className="absolute inset-0 justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <View className="w-72 p-5 bg-white rounded-[20px] flex-col justify-center items-center gap-4">
        <Text className="self-stretch justify-start text-gray-900 text-lg font-semibold leading-7 mb-1">
          {title}
        </Text>
        <Text className="self-stretch justify-start text-gray-600 text-sm font-medium leading-6 mb-4.5">
          {message}
        </Text>
        <TouchableOpacity onPress={onClose} className="self-stretch">
          <Text className="self-stretch text-right justify-center text-green-500 text-sm font-medium leading-6">
            확인
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
