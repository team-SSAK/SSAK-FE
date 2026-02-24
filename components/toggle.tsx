import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ToggleProps {
  value: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onChange, disabled }: ToggleProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 160 });
  }, [value]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 10 }],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#E2E8F0", "#65C466"],
    ),
  }));

  return (
    <Pressable onPress={() => !disabled && onChange?.(!value)}>
      <Animated.View
        style={[
          {
            width: 28,
            height: 20,
            padding: 2,
            borderRadius: 9999,
            justifyContent: "center",
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: 14,
              height: 14,
              backgroundColor: "white",
              borderRadius: 9999,
            },
            knobStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
