import { CheckCircle2 } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

interface OwnerBadgeProps {
  onPress?: () => void;
}

export default function OwnerBadge({ onPress }: OwnerBadgeProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <CheckCircle2 size={16} color="#22C55E" />
    </TouchableOpacity>
  );
}
