import AlertPopup from "./alertpopup";

interface OwnerBadgeModalProps {
  visible: boolean;
  onConfirm: () => void;
}

export default function OwnerBadgeModal({ visible, onConfirm }: OwnerBadgeModalProps) {
  return (
    <AlertPopup
      visible={visible}
      title="사장님 인증 계정"
      description="식당 사장님으로 인증된 계정입니다."
      onConfirm={onConfirm}
      confirmText="확인"
    />
  );
}
