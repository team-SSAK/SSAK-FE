import AlertPopup from "./alertpopup";

interface OutOfRangeModalProps {
  visible: boolean;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function OutOfRangeModal({
  visible,
  onConfirm,
  title = "식당 반경을 벗어났습니다",
  description = "게시글 작성은 식당 100m 이내에서만 가능합니다.",
}: OutOfRangeModalProps) {
  return (
    <AlertPopup
      visible={visible}
      title={title}
      description={description}
      onConfirm={onConfirm}
      confirmText="확인"
    />
  );
}
