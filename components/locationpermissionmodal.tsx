import { Linking } from "react-native";
import AlertPopup from "./alertpopup";

interface LocationPermissionModalProps {
  visible: boolean;
  onCancel: () => void;
  description?: string;
}

export default function LocationPermissionModal({ visible, onCancel, description }: LocationPermissionModalProps) {
  return (
    <AlertPopup
      visible={visible}
      title="위치 권한이 필요해요"
      description={description ?? "위치 접근을 허용해 주세요."}
      onCancel={onCancel}
      onConfirm={() => Linking.openSettings()}
      cancelText="취소"
      confirmText="설정하기"
    />
  );
}
