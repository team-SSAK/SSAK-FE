import AlertPopup from "./alertpopup";

interface OwnerBadgeModalProps {
  visible: boolean;
  restaurantName?: string;
  onConfirm: () => void;
}

export default function OwnerBadgeModal({ visible, restaurantName, onConfirm }: OwnerBadgeModalProps) {
  const description = restaurantName
    ? `'${restaurantName}' 식당의 사장님임이 확인되었어요.`
    : "식당 사장님으로 인증된 계정입니다.";

  return (
    <AlertPopup
      visible={visible}
      title="식당 사장님으로 인증된 계정"
      description={description}
      onConfirm={onConfirm}
      confirmText="확인"
    />
  );
}
