import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AlertPopupRadioProps {
  title?: string;
  description?: string;
  visible?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
}

export default function AlertPopupRadio({
  title = "알림",
  description = "",
  visible = false,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "확인",
  confirmColor = "bg-lime-600",
}: AlertPopupRadioProps) {
  // 하드코딩된 옵션
  const options = [
    { label: "욕설 및 인신공격", value: "abuse" },
    { label: "음란 또는 부적절한 내용", value: "inappropriate" },
    { label: "광고 및 홍보", value: "ad" },
    { label: "개인정보 노출", value: "privacy" },
    { label: "같은 내용 반복 게시", value: "repeat" },
  ];
  const [selectedValue, setSelectedValue] = useState(options[0].value);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-72 p-5 bg-white rounded-[20px] gap-[18px]">
          <View className="gap-1 mb-2">
            <Text className="text-slate-800 text-lg font-semibold leading-7">
              {title}
            </Text>
            {description ? (
              <Text className="text-slate-500 text-sm font-medium leading-6 mt-2">
                {description}
              </Text>
            ) : null}
            <View style={{ marginTop: 18 }} />
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                className="flex-row items-center mb-2"
                onPress={() => setSelectedValue(opt.value)}
                activeOpacity={0.7}
              >
                {selectedValue === opt.value ? (
                  <View className="w-5 h-5 bg-white rounded-full border-[6px] border-green-400 mr-2" />
                ) : (
                  <View className="w-5 h-5 bg-white rounded-full border border-gray-400 mr-2" />
                )}
                <Text className="text-gray-800 font-medium leading-6">
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row gap-2">
            {onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 h-10 bg-slate-100 rounded-[10px] justify-center items-center"
              >
                <Text className="text-slate-800 text-base font-medium leading-6">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity
                onPress={() => onConfirm?.(selectedValue)}
                className={`flex-1 h-10 ${confirmColor} rounded-[10px] justify-center items-center`}
              >
                <Text className="text-white text-base font-medium leading-6">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
