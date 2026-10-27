import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AlertPopupProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  visible?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
}

export default function AlertPopup({
  title = "알림",
  description = "",
  visible = false,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "확인",
  confirmColor = "bg-green-400",
}: AlertPopupProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/10 justify-center items-center">
        <View className="w-[284px] p-5 bg-white rounded-[20px] gap-[18px]">
          <View className="gap-1">
            <Text className="text-gray-900 text-lg font-semibold leading-7">
              {title}
            </Text>
            <Text className="text-gray-600 text-sm font-medium leading-[22px]">
              {description}
            </Text>
          </View>

          <View className="flex-row gap-2">
            {onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 h-10 bg-gray-100 rounded-[10px] justify-center items-center"
              >
                <Text className="text-gray-900 text-base font-medium leading-6">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity
                onPress={onConfirm}
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
