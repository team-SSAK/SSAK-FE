import { Linking } from "react-native";
import AlertPopup from "./alertpopup";

interface LocationPermissionModalProps {
  visible: boolean;
  onCancel: () => void;
}

export default function LocationPermissionModal({ visible, onCancel }: LocationPermissionModalProps) {
  return (
    <AlertPopup
      visible={visible}
      title="위치 권한이 필요합니다"
      description="지도에서 현재 위치를 사용하려면 위치 권한을 허용해 주세요."
      onCancel={onCancel}
      onConfirm={() => Linking.openSettings()}
      cancelText="취소"
      confirmText="설정으로 이동"
    />
  );
}
