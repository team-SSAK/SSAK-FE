import { View } from "react-native";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps = 4,
}: StepIndicatorProps) {
  return (
    <View className="flex-row justify-start items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} className="w-1.5 h-1.5 relative">
          <View
            className={`w-1.5 h-1.5 left-0 top-0 absolute rounded-full ${
              index === currentStep ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        </View>
      ))}
    </View>
  );
}
